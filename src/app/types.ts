import { DateTime } from "luxon";

export interface IProductInformation {
    productQualityComplaint: boolean | null;

    userType: UserTypes;

    brand: string;
    lotNumber: string | null;
}

export interface IPersonalData {
    firstName: string;
    lastName: string;

    sex: string;
    pregnant?: string | null;

    birthdate: DateTime;
}

export interface IAddress {
    streetAddress: string;
    streetAddress2: string | null;
    city: string;
    state: string;
    zipPostal: string;
}

export interface IPersonalInformation {
    personalData: IPersonalData;
    physicalAddress: IAddress;
}

export enum UserTypes {
    Patient = "patient",
    Doctor = "doctor"
}

export interface IProblemSummary {
    issueVerbatim: string;

    images?: File[];
}
