import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Question } from "../questions";
import { IProductInformation, UserTypes } from "../types";

export interface IQuestionsRequest {
  product: IProductInformation;

  userType: UserTypes;
  verbatim: string;
}

export interface IQuestionsResponse {
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  getNextQuestions(request: IQuestionsRequest): Observable<IQuestionsResponse> {
    return of({
      questions: [
        {
          type: "multiple-choice",
          required: true,
          questionText: `How experienced are you with ${request.product.brand}?`,
          options: [
            "This was my first time",
            "I'm somewhat experienced",
            "I've been using it for a long time"
          ]
        }
      ]
    })
  }
}
