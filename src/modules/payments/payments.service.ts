// import {
//   BadRequestException,
//   HttpStatus,
//   Inject,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { PaidVia, UserRole } from '@prisma/client';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { PrismaService } from 'src/core/database/prisma.service';
// import { Transaction } from 'ioredis/built/transaction';
// import { amountToPenny, getInMills, pennyToAmount, validateWithinMinutes } from 'src/core/utils/time';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { TAuthUser } from 'src/common/types/user';
// import { PaymeAccountRecord, PaymeErrorCode, PaymeErrorResponse, PaymeMethods, PaymeRequest, PaymeRequestParams, PaymeResponse, PaymeResponses, PaymeTransaction, PaymeTransactionReason, PaymeTransactionState } from 'src/common/types/payments_types/payme';

// @Injectable()
// export class PaymentsService {
//   constructor(
//     private prisma: PrismaService,
//     @Inject(CACHE_MANAGER) private cacheStore: Cache,
//   ) {}

//   private MERCHANT_ID = process.env.PAYME_MERCHANT_ID as string;
//   private MERCHANT_KEY = process.env.PAYME_KEY as string;
//   private $paymeCheckoutUrl = process.env.PAYME_CHECKOUT_URL as string;
//   private $transactionTimeout = 30; // in minutes

//   async createPayment(payload: CreatePaymentDto, authUser: TAuthUser) {
//     const course = await this.prisma.course.findUnique({
//       where: {
//         published: true,
//         id: payload.courseId,
//       },
//     });
//     if (!course) {
//       throw new NotFoundException('Course not found');
//     }
//     const purchasedCourse = await this.prisma.purchasedCourse.findUnique({
//       where: {
//         userId_courseId: {
//           courseId: payload.courseId,
//           userId: authUser.id,
//         },
//       },
//     });
//     if (purchasedCourse) {
//       throw new BadRequestException('User already purchased this course');
//     }
//     const checkoutPayload = Buffer.from(
//       `m=${this.MERCHANT_ID};a=${amountToPenny(
//         course.price.toNumber(),
//       )};ac.course_id=${course.id};ac.user_id=${authUser.id}`,
//     ).toString('base64');
//     return this.$paymeCheckoutUrl + checkoutPayload;  
//   }

//   private validateUserId(id: string): PaymeErrorResponse | Record<any, any> {
//     const validUserId = new RegExp('^[0-9]*$');
//     if (validUserId.test(id)) {
//       return {};
//     } else {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_ACCOUNT,
//           data: 'user_id',
//           message: {
//             en: 'Invalid user ID! Only numbers allowed.',
//             ru: 'Неверный ID пользователя! Разрешены только цифры.',
//             uz: "Noto'g'ri foydalanuvchi IDsi! Faqat raqam kiriting.",
//           },
//         },
//       } as PaymeErrorResponse;
//     }
//   }

//   private async checkAccount(account: PaymeAccountRecord, amount: number) {
//     const checkUserId = this.validateUserId(account.user_id);
//     if ('error' in checkUserId) {
//       return checkUserId as PaymeErrorResponse;
//     }
//     const user = await this.prisma.user.findUnique({
//       where: { id: parseInt(account.user_id), role: UserRole.STUDENT },
//     });
//     if (!user) {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_ACCOUNT,
//           data: 'user_id',
//           message: {
//             en: 'User not found',
//             ru: 'Пользователь не найден',
//             uz: 'Foydalanuvchi topilmadi',
//           },
//         },
//       } as PaymeErrorResponse;
//     }
//     const course = await this.prisma.course.findUnique({
//       where: { id: account.course_id, published: true },
//       select: {
//         id: true,
//         price: true,
//         name: true,
//       },
//     });
//     if (!course) {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_ACCOUNT,
//           data: 'course_id',
//           message: {
//             en: 'Course not found',
//             ru: 'Курс не найден',
//             uz: 'Kurs topilmadi',
//           },
//         },
//       } as PaymeErrorResponse;
//     }
//     const purchasedCourse = await this.prisma.purchasedCourse.findUnique({
//       where: {
//         userId_courseId: {
//           userId: user.id,
//           courseId: course.id,
//         },
//       },
//     });
//     if (purchasedCourse) {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_ACCOUNT,
//           message: {
//             en: 'The course was already purchased',
//             ru: 'Курс уже куплен',
//             uz: 'Ushbu kurs allaqachon sotib olingan',
//           },
//         },
//       } as PaymeErrorResponse;
//     }
//     if (pennyToAmount(amount) !== course.price.toNumber()) {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_AMOUNT,
//           message: {
//             en: 'Invalid amount',
//             ru: 'Недопустимая сумма',
//             uz: "Noto'g'ri summa",
//           },
//         },
//       } as PaymeErrorResponse;
//     }

//     return { user, course };
//   }

//   private async CheckPerformTransaction(
//     payload: PaymeRequestParams[PaymeMethods.CheckPerformTransaction],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.CheckPerformTransaction]>
//     | PaymeErrorResponse
//   > {
//     const account = await this.checkAccount(payload.account, payload.amount);
//     if ('error' in account) {
//       return account;
//     }
//     return {
//       result: {
//         allow: true,
//         additional: {
//           course_name: account.course.name,
//           course_price: account.course.price.toNumber(),
//           user_full_name: account.user.fullName,
//         },
//       },
//     };
//   }

//   private async validateTransactionTimeout(
//     transaction: Transaction,
//   ): Promise<Record<any, any> | PaymeErrorResponse> {
//     if (
//       !validateWithinMinutes(
//         new Date(transaction.create_time),
//         this.$transactionTimeout,
//       )
//     ) {
//       await this.prisma.transaction.update({
//         where: { id: transaction.id },
//         data: {
//           state: PaymeTransactionState.CANCELLED,
//           reason: PaymeTransactionReason.TIMEOUT,
//         },
//       });
//       return {
//         error: {
//           code: PaymeErrorCode.CANNOT_PERFORM_OPERATION,
//         },
//       } as PaymeErrorResponse;
//     }
//     return {};
//   }

//   private async CreateTransaction(
//     payload: PaymeRequestParams[PaymeMethods.CreateTransaction],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.CreateTransaction]>
//     | PaymeErrorResponse
//   > {
//     const account = await this.checkAccount(payload.account, payload.amount);
//     if ('error' in account) {
//       return account;
//     }
//     const pendingTransaction = await this.prisma.transaction.findFirst({
//       where: {
//         userId: parseInt(payload.account.user_id),
//         courseId: payload.account.course_id,
//         state: PaymeTransactionState.CREATED,
//         pid: {
//           not: payload.id,
//         },
//       },
//     });
//     if (pendingTransaction) {
//       return {
//         error: {
//           code: PaymeErrorCode.INVALID_ACCOUNT,
//           message: {
//             en: 'Transaction is in que',
//             ru: 'Транзакция в очереди',
//             uz: 'Tranzaksiya navbatda',
//           },
//         },
//       } as PaymeErrorResponse;
//     }
//     const transaction = await this.prisma.transaction.findFirst({
//       where: { pid: payload.id },
//     });
//     if (transaction) {
//       const validateTimeout = await this.validateTransactionTimeout(
//         transaction,
//       );
//       if ('error' in validateTimeout) {
//         return validateTimeout as PaymeErrorResponse;
//       }
//       return {
//         result: {
//           create_time: getInMills(transaction.create_time),
//           state: transaction.state,
//           transaction: transaction.id,
//         },
//       };
//     }
//     const newTransaction = await this.prisma.transaction.create({
//       data: {
//         userId: parseInt(payload.account.user_id),
//         courseId: payload.account.course_id,
//         pid: payload.id,
//         create_time: new Date(),
//         state: PaymeTransactionState.CREATED,
//         amount: pennyToAmount(payload.amount),
//       },
//     });
//     return {
//       result: {
//         transaction: newTransaction.id,
//         state: newTransaction.state,
//         create_time: getInMills(newTransaction.create_time),
//       },
//     };
//   }

//   private TRANSACTION_NOT_FOUND_ERROR: PaymeErrorResponse = {
//     error: {
//       code: PaymeErrorCode.TRANSACTION_NOT_FOUND,
//       message: {
//         en: 'Transaction not found',
//         ru: 'Транзакция не найдена',
//         uz: 'Tranzaksiya topilmadi',
//       },
//     },
//   };

//   private async PerformTransaction(
//     payload: PaymeRequestParams[PaymeMethods.PerformTransaction],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.PerformTransaction]>
//     | PaymeErrorResponse
//   > {
//     const transaction = await this.prisma.transaction.findUnique({
//       where: { pid: payload.id },
//     });
//     if (!transaction) {
//       return this.TRANSACTION_NOT_FOUND_ERROR;
//     }
//     if (transaction.state !== PaymeTransactionState.CREATED) {
//       if (transaction.state !== PaymeTransactionState.COMPLETED) {
//         return {
//           error: {
//             code: PaymeErrorCode.TRANSACTION_NOT_FOUND,
//             message: {
//               en: 'Cannot perform transaction',
//               ru: 'Невозможно выполнить транзакцию',
//               uz: "Tranzaksiyani amalga oshirib bo'lmaydi",
//             },
//           },
//         } as PaymeErrorResponse;
//       }
//       return {
//         result: {
//           transaction: transaction.id,
//           state: transaction.state,
//           perform_time: getInMills(transaction.perform_time),
//         },
//       };
//     }
//     const validateTimeout = await this.validateTransactionTimeout(transaction);
//     if ('error' in validateTimeout) {
//       return validateTimeout as PaymeErrorResponse;
//     }
//     await this.prisma.purchasedCourse.create({
//       data: {
//         userId: transaction.userId,
//         courseId: transaction.courseId,
//         amount: transaction.amount,
//         paidVia: PaidVia.PAYME,
//       },
//     });
//     const editedTransaction = await this.prisma.transaction.update({
//       where: { id: transaction.id },
//       data: {
//         state: PaymeTransactionState.COMPLETED,
//         perform_time: new Date(),
//       },
//     });
//     return {
//       result: {
//         transaction: transaction.id,
//         perform_time: getInMills(editedTransaction.perform_time),
//         state: editedTransaction.state,
//       },
//     };
//   }

//   private async CheckTransaction(
//     payload: PaymeRequestParams[PaymeMethods.CheckTransaction],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.CheckTransaction]>
//     | PaymeErrorResponse
//   > {
//     const transaction = await this.prisma.transaction.findUnique({
//       where: { pid: payload.id },
//     });
//     if (!transaction) {
//       return this.TRANSACTION_NOT_FOUND_ERROR;
//     }
//     return {
//       result: {
//         state: transaction.state,
//         transaction: transaction.id,
//         reason: transaction.reason,
//         perform_time: getInMills(transaction.perform_time),
//         create_time: getInMills(transaction.create_time),
//         cancel_time: getInMills(transaction.cancel_time),
//       },
//     };
//   }

//   private async CancelTransaction(
//     payload: PaymeRequestParams[PaymeMethods.CancelTransaction],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.CancelTransaction]>
//     | PaymeErrorResponse
//   > {
//     const transaction = await this.prisma.transaction.findUnique({
//       where: { pid: payload.id },
//     });
//     if (!transaction) {
//       return this.TRANSACTION_NOT_FOUND_ERROR;
//     }
//     if (transaction.state === PaymeTransactionState.CREATED) {
//       const updatedTransaction = await this.prisma.transaction.update({
//         where: { id: transaction.id },
//         data: {
//           state: PaymeTransactionState.CANCELLED,
//           cancel_time: new Date(),
//           reason: payload.reason,
//         },
//       });
//       return {
//         result: {
//           transaction: updatedTransaction.id,
//           cancel_time: getInMills(updatedTransaction.cancel_time),
//           state: updatedTransaction.state,
//         },
//       };
//     }
//     if (transaction.state !== PaymeTransactionState.COMPLETED) {
//       return {
//         result: {
//           transaction: transaction.id,
//           cancel_time: getInMills(transaction.cancel_time),
//           state: transaction.state,
//         },
//       };
//     }
//     //   TODO: Check is it possible to cancel order
//     const purchasedCourse = await this.prisma.purchasedCourse.findUnique({
//       where: {
//         userId_courseId: {
//           userId: transaction.userId,
//           courseId: transaction.courseId,
//         },
//       },
//     });
//     if (purchasedCourse) {
//       return {
//         error: {
//           code: PaymeErrorCode.CANNOT_CANCEL_TRANSACTION,
//           message: {
//             en: 'Cannot cancel transaction',
//             ru: 'Невозможно отменить транзакцию',
//             uz: 'Tranzaksiyani bekor qilib bo‘lmaydi',
//           },
//         },
//       } as PaymeErrorResponse;
//     }

//     const updatedTransaction = await this.prisma.transaction.update({
//       where: { id: transaction.id },
//       data: {
//         state: PaymeTransactionState.CANCELLED_AFTER_PAYMENT,
//         cancel_time: new Date(),
//         reason: payload.reason,
//       },
//     });
//     return {
//       result: {
//         transaction: updatedTransaction.id,
//         cancel_time: getInMills(updatedTransaction.cancel_time),
//         state: updatedTransaction.state,
//       },
//     };
//   }

//   private async GetStatement(
//     payload: PaymeRequestParams[PaymeMethods.GetStatement],
//   ): Promise<
//     | PaymeResponse<PaymeResponses[PaymeMethods.GetStatement]>
//     | PaymeErrorResponse
//   > {
//     const transactions = await this.prisma.transaction.findMany({
//       where: {
//         create_time: {
//           gte: new Date(payload.from),
//           lte: new Date(payload.to),
//         },
//       },
//     });
//     return {
//       result: {
//         transactions: transactions.map<PaymeTransaction>((transaction) => ({
//           id: transaction.pid,
//           transaction: transaction.id,
//           state: transaction.state,
//           reason: transaction.reason,
//           amount: amountToPenny(transaction.amount.toNumber()),
//           time: getInMills(transaction.create_time),
//           create_time: getInMills(transaction.create_time),
//           perform_time: getInMills(transaction.perform_time),
//           cancel_time: getInMills(transaction.cancel_time),
//           account: {
//             course_id: transaction.courseId,
//             user_id: String(transaction.userId),
//           },
//         })),
//       },
//     };
//   }

//   private authenticate(
//     headers: Headers,
//   ): Record<any, any> | PaymeErrorResponse {
//     const error = {
//       error: {
//         code: PaymeErrorCode.INSUFFICIENT_PRIVILEGES,
//         message: {
//           en: 'Authentication failed',
//           ru: 'Authentication failed',
//           uz: 'Authentication failed',
//         },
//       },
//     } as PaymeErrorResponse;
//     if (!('authorization' in headers)) {
//       return error;
//     }
//     try {
//       const token = (headers.authorization as string).split(' ')[1];
//       const decoded = Buffer.from(token, 'base64').toString();
//       const [login, password] = decoded.split(':');
//       if (password !== this.MERCHANT_KEY) {
//         return error;
//       }
//       return {};
//     } catch {
//       return error;
//     }
//   }

//   async handlePaymeRequest(payload: PaymeRequest, req: Request, res: Response) {
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     res.status(HttpStatus.OK);
//     const authRes = this.authenticate(req.headers);
//     if ('error' in authRes) {
//       return authRes;
//     }

//     switch (payload.method) {
//       case PaymeMethods.CheckPerformTransaction:
//         return await this.CheckPerformTransaction(
//           payload.params as PaymeRequestParams[PaymeMethods.CheckPerformTransaction],
//         );

//       case PaymeMethods.CreateTransaction:
//         return await this.CreateTransaction(
//           payload.params as PaymeRequestParams[PaymeMethods.CreateTransaction],
//         );

//       case PaymeMethods.PerformTransaction:
//         return await this.PerformTransaction(
//           payload.params as PaymeRequestParams[PaymeMethods.PerformTransaction],
//         );

//       case PaymeMethods.CheckTransaction:
//         return await this.CheckTransaction(
//           payload.params as PaymeRequestParams[PaymeMethods.CheckTransaction],
//         );

//       case PaymeMethods.CancelTransaction:
//         return await this.CancelTransaction(
//           payload.params as PaymeRequestParams[PaymeMethods.CancelTransaction],
//         );

//       case PaymeMethods.GetStatement:
//         return await this.GetStatement(
//           payload.params as PaymeRequestParams[PaymeMethods.GetStatement],
//         );

//       default:
//         return {
//           error: {
//             code: PaymeErrorCode.INVALID_METHOD_NAME,
//             message: {
//               en: 'Invalid method name',
//               ru: 'Invalid method name',
//               uz: 'Invalid method name',
//             },
//           },
//         } as PaymeErrorResponse;
//     }
//   }

//   // TODO: Will be removed
//   async deleteTransactions() {
//     await this.prisma.purchasedCourse.deleteMany();
//     return this.prisma.transaction.deleteMany();
//   }
// }
