import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Question } from "../questions";
import { IProductInformation, UserTypes } from "../types";

export interface IQuestionsRequestAnswer {
  questionText: string;
  response: string;
}

export interface IQuestionsRequest {
  product: IProductInformation;

  userType: UserTypes;
  verbatim: string;

  answeredQuestions: IQuestionsRequestAnswer[];
}

export interface IQuestionsResponse {
  done: boolean;
  questions: Question[];
}

interface IQuestionMultiAnswer {
  questionText: string;
  responses: string[];
}

interface IQuestionCandidate {
  brands?: string[];
  prerequisiteAnswers?: IQuestionMultiAnswer[];
  question: Question;
}

const allQuestions: IQuestionCandidate[] = [
  {
    brands: ["Tremfya"],
    question: {
      type: "multiple-choice",
      required: true,
      questionText: "How experienced are you with Tremfya?",
      options: [
        "This was my first time",
        "I'm somewhat experienced",
        "I've been using it for a long time"
      ]
    }
  },
  {
    brands: ["Tremfya"],
    prerequisiteAnswers: [
      {
        questionText: "How experienced are you with Tremfya?",
        responses: ["This was my first time"]
      }
    ],
    question: {
      type: "multiple-choice",
      required: true,
      questionText: "How did you learn how to use the injector?",
      options: [
        "My healthcare provider showed me",
        "I read the instructions",
        "I watched videos online",
      ]
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  getNextQuestions(request: IQuestionsRequest): Observable<IQuestionsResponse> {
    const answersMap = new Map(request.answeredQuestions.map(x => [x.questionText, x.response]));

    const candidates = allQuestions.filter(candidate => {
      if (answersMap.get(candidate.question.questionText)) {
        return false;
      }

      if (candidate.brands && !candidate.brands.includes(request.product.brand)) {
        return false;
      }

      if (candidate.prerequisiteAnswers) {
        for (const prereq of candidate.prerequisiteAnswers) {
          const answer = answersMap.get(prereq.questionText);
          if (!answer || !prereq.responses.includes(answer)) {
            return false;
          }
        }
      }

      return true;
    });

    return of({
      done: candidates.length === 0,
      questions: candidates.map(c => c.question)
    })
  }
}
