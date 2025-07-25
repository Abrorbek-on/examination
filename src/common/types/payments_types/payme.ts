export enum PaymeMethods {
    CheckPerformTransaction = 'CheckPerformTransaction',
    CreateTransaction = 'CreateTransaction',
    PerformTransaction = 'PerformTransaction',
    CancelTransaction = 'CancelTransaction',
    CheckTransaction = 'CheckTransaction',
    GetStatement = 'GetStatement',
}

export enum PaymeErrorCode {
    NOT_POST_REQUEST = -32300,
    INVALID_JSON = -32700,
    REQUIRED_FIELD_NOT_FOUND = -32600,
    INVALID_METHOD_NAME = -32601,
    INSUFFICIENT_PRIVILEGES = -32504,
    SYSTEM_ERROR = -32400,
    INVALID_AMOUNT = -31001,
    INVALID_ACCOUNT = -31050,
    TRANSACTION_NOT_FOUND = -31003,
    CANNOT_PERFORM_OPERATION = -31008,
    CANNOT_CANCEL_TRANSACTION = -31007,
}

export enum PaymeTransactionState {
    CREATED = 1,
    COMPLETED = 2,
    CANCELLED = -1,
    CANCELLED_AFTER_PAYMENT = -2,
}

export enum PaymeTransactionReason {
    RECEIVERS_INACTIVE = 1,
    DEBIT_OPERATION_ERROR = 2,
    EXECUTION_ERROR = 3,
    TIMEOUT = 4,
    REFUND = 5,
    UNKNOWN_ERROR = 10,
}

export interface PaymeAccountRecord {
    course_id: string;
    user_id: string;
}

export interface PaymeRequest<
    T = PaymeRequestParams[
    | PaymeMethods.CheckPerformTransaction
    | PaymeMethods.CheckTransaction
    | PaymeMethods.GetStatement
    | PaymeMethods.CancelTransaction
    | PaymeMethods.CreateTransaction
    | PaymeMethods.PerformTransaction],
> {
    method: PaymeMethods;
    params: T;
    id?: number;
}

export interface PaymeResponse<T> {
    result: T;
    id?: number;
}

export interface PaymeErrorResponse {
    error: {
        code: number | PaymeErrorCode;
        message: {
            ru: string;
            uz: string;
            en: string;
        };
        data?: keyof PaymeAccountRecord;
    };
    id?: number;
}

export interface PaymeTransactionReceiver {
    id: string;
    amount: number;
}

export interface PaymeTransaction<T = PaymeAccountRecord> {
    id: string;
    time: number;
    amount: number;
    account: T;
    create_time: number;
    perform_time: number;
    cancel_time: number;
    transaction: string;
    state: PaymeTransactionState;
    reason: PaymeTransactionReason | null;
    receivers?: PaymeTransactionReceiver[] | null;
}

export interface PaymeRequestParams {
    [PaymeMethods.CheckPerformTransaction]: {
        amount: number;
        account: PaymeAccountRecord;
    };
    [PaymeMethods.CreateTransaction]: {
        id: string;
        time: number;
        amount: number;
        account: PaymeAccountRecord;
    };
    [PaymeMethods.PerformTransaction]: {
        id: string;
    };
    [PaymeMethods.CancelTransaction]: {
        id: string;
        reason: PaymeTransactionReason;
    };
    [PaymeMethods.CheckTransaction]: {
        id: string;
    };
    [PaymeMethods.GetStatement]: {
        from: number;
        to: number;
    };
}

export interface PaymeResponses {
    [PaymeMethods.CheckPerformTransaction]: {
        allow: boolean;
        additional?: Record<string, string | number>;
        detail?: {
            receipt_type?: number; // fiscal cheque type
            shipping?: {
                title: string;
                price: number;
            };
            items?: {
                // Items required when receipt_type defined
                discount: number;
                title: string;
                price: number;
                count: number;
                code: string;
                units: number;
                vat_percent: number;
                package_code: string;
            }[];
        };
    };
    [PaymeMethods.CreateTransaction]: {
        create_time: number;
        transaction: string;
        state: PaymeTransactionState;
        receivers?: PaymeTransactionReceiver[] | null;
    };
    [PaymeMethods.PerformTransaction]: {
        transaction: string;
        perform_time: number;
        state: PaymeTransactionState;
    };
    [PaymeMethods.CancelTransaction]: {
        transaction: string;
        cancel_time: number;
        state:
        | PaymeTransactionState
        | PaymeTransactionState.CANCELLED_AFTER_PAYMENT;
    };
    [PaymeMethods.CheckTransaction]: {
        create_time: number;
        perform_time: number;
        cancel_time: number;
        transaction: string;
        state: PaymeTransactionState | PaymeTransactionState.COMPLETED;
        reason: PaymeTransactionReason | null;
    };
    [PaymeMethods.GetStatement]: {
        transactions: PaymeTransaction[];
    };
}
