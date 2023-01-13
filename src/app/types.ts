
export interface IProductInformation {
    brand: string;
    lotNumber: string | null;
}

export interface IContactInformation {
    firstName: string;
    lastName: string;

    streetAddress: string;
    streetAddress2: string | null;
    city: string;
    state: string;
    zipPostal: string;
}

export enum UserTypes {
    Patient = "patient",
    Doctor = "doctor"
}

export interface IProblemSummary {
    userType: UserTypes;

    issueVerbatim: string;

    images?: File[];
}
