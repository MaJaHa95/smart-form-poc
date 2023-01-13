
export interface IQuestionBase<T extends string> {
    type: T;
    required: boolean;
}

export interface IFreeTextQuestion extends IQuestionBase<"free-text"> {
    questionText: string;
    helpText?: string;
}

export interface IMultipleChoiceQuestion extends IQuestionBase<"multiple-choice"> {
    questionText: string;
    options: string[];
}

export type Question = IFreeTextQuestion | IMultipleChoiceQuestion;
