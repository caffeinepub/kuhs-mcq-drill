import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Question {
    explanation: string;
    answerOptions: Array<string>;
    questionText: string;
    correctAnswerIndex: bigint;
    questionId: bigint;
    category: string;
}
export interface backendInterface {
    createQuestion(questionText: string, answerOptions: Array<string>, correctAnswerIndex: bigint, explanation: string, category: string): Promise<bigint>;
    deleteQuestion(id: bigint): Promise<void>;
    getAllQuestions(): Promise<Array<Question>>;
    getQuestion(id: bigint): Promise<Question>;
    getQuestionsByCategory(category: string): Promise<Array<Question>>;
    initializeDefaultQuestions(): Promise<void>;
    updateQuestion(id: bigint, updatedQuestion: Question): Promise<void>;
}
