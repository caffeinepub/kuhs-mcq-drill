import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

actor {
  type Question = {
    questionId : Nat;
    questionText : Text;
    answerOptions : [Text];
    correctAnswerIndex : Nat;
    explanation : Text;
    category : Text;
  };

  var nextId = 6;
  var adminPrincipal : ?Principal = null;
  stable var stableQuestionsEntries : [(Nat, Question)] = [];
  stable var stableNextId : Nat = 6;
  stable var stableAdminPrincipal : ?Principal = null;

  let questions = Map.empty<Nat, Question>();

  system func preupgrade() {
    stableQuestionsEntries := questions.entries().toArray();
    stableNextId := nextId;
    stableAdminPrincipal := adminPrincipal;
  };

  system func postupgrade() {
    for ((k, v) in stableQuestionsEntries.values()) {
      questions.add(k, v);
    };
    stableQuestionsEntries := [];
    nextId := stableNextId;
    adminPrincipal := stableAdminPrincipal;
  };

  func getQuestionInternal(id : Nat) : Question {
    switch (questions.get(id)) {
      case (null) { Runtime.trap("Question does not exist") };
      case (?question) { question };
    };
  };

  public shared ({ caller }) func claimAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) {
        adminPrincipal := ?caller;
        true;
      };
      case (?_) { false };
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) { false };
      case (?admin) { caller == admin };
    };
  };

  public query func getAdminPrincipal() : async ?Principal {
    adminPrincipal;
  };

  public shared func createQuestion(
    questionText : Text,
    answerOptions : [Text],
    correctAnswerIndex : Nat,
    explanation : Text,
    category : Text,
  ) : async Nat {
    if (answerOptions.size() != 4) { Runtime.trap("There must be exactly 4 answer options.") };
    let question = {
      questionId = nextId;
      questionText;
      answerOptions;
      correctAnswerIndex;
      explanation;
      category;
    };
    questions.add(nextId, question);
    nextId += 1;
    nextId - 1;
  };

  public query func getQuestion(id : Nat) : async Question {
    getQuestionInternal(id);
  };

  public query func getAllQuestions() : async [Question] {
    questions.values().toArray().sort(func(a : Question, b : Question) : Order.Order {
      Nat.compare(b.questionId, a.questionId);
    });
  };

  public query func getQuestionsByCategory(category : Text) : async [Question] {
    questions.values().filter(func(q) { q.category == category }).toArray().sort(func(a : Question, b : Question) : Order.Order {
      Nat.compare(b.questionId, a.questionId);
    });
  };

  public shared func updateQuestion(id : Nat, updatedQuestion : Question) : async () {
    ignore getQuestionInternal(id);
    questions.add(id, updatedQuestion);
  };

  public shared func deleteQuestion(id : Nat) : async () {
    ignore getQuestionInternal(id);
    questions.remove(id);
  };

  public shared func initializeDefaultQuestions() : async () {
    if (questions.isEmpty()) {
      let defaultQuestions : [Question] = [
        {
          questionId = 1;
          questionText = "Which bone is known as the collarbone?";
          answerOptions = ["Scapula", "Sternum", "Clavicle", "Humerus"];
          correctAnswerIndex = 2;
          explanation = "The clavicle is also known as the collarbone. It connects the arm to the body.";
          category = "Anatomy";
        },
        {
          questionId = 2;
          questionText = "What organ is responsible for filtering blood in the human body?";
          answerOptions = ["Liver", "Kidney", "Lung", "Heart"];
          correctAnswerIndex = 1;
          explanation = "The kidney filters waste products from the blood to form urine.";
          category = "Physiology";
        },
        {
          questionId = 3;
          questionText = "Which muscle is primarily responsible for breathing?";
          answerOptions = ["Biceps", "Diaphragm", "Triceps", "Pectorals"];
          correctAnswerIndex = 1;
          explanation = "The diaphragm contracts and relaxes to help draw air into the lungs.";
          category = "Anatomy";
        },
        {
          questionId = 4;
          questionText = "What is the largest internal organ in the human body?";
          answerOptions = ["Heart", "Brain", "Liver", "Kidney"];
          correctAnswerIndex = 2;
          explanation = "The liver is the largest internal organ, playing a vital role in metabolism and detoxification.";
          category = "Anatomy";
        },
        {
          questionId = 5;
          questionText = "What is the main function of red blood cells?";
          answerOptions = ["Fight infection", "Transport oxygen", "Clot blood", "Digest food"];
          correctAnswerIndex = 1;
          explanation = "Red blood cells contain hemoglobin, which carries oxygen from the lungs to body tissues.";
          category = "Physiology";
        },
      ];
      for (q in defaultQuestions.values()) {
        questions.add(q.questionId, q);
      };
      nextId := 6;
    };
  };
};
