
export interface IQuestionBase<T extends string, TId extends string = string> {
    id: TId;
    type: T;
    required: boolean;
}

export interface IFreeTextQuestion<TId extends string = string> extends IQuestionBase<"free-text", TId> {
    questionText: string;
    helpText?: string;

    nextQuestionId?: string;
}

export interface IMultipleChoiceOption<TId extends string = string> {
    name: string;

    nextQuestionId?: string;
}

export interface IMultipleChoiceQuestion<TId extends string = string> extends IQuestionBase<"multiple-choice", TId> {
    questionText: string;
    options: IMultipleChoiceOption<TId>[];
}

export interface IImageMapOption<TId extends string = string> {
    value: string;

    x: number;
    y: number;

    radius: number;

    nextQuestionId?: string;
}

export interface IImageMapQuestion<TId extends string = string> extends IQuestionBase<"image-map", TId> {
    questionText?: string;
    imageUrl: string;
    areas: IImageMapOption<TId>[];
}

export interface IDatePickerQuestion<TId extends string = string> extends IQuestionBase<"date-picker", TId> {
    questionText: string;
}

export type Question<TId extends string = string> =
    | IFreeTextQuestion<TId>
    | IMultipleChoiceQuestion<TId>
    | IImageMapQuestion<TId>
    | IDatePickerQuestion<TId>;
