import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

// Custom Alert components
const Alert = ({ children, className }) => (
  <div className={`p-4 mb-4 border rounded ${className}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }) => (
  <h3 className="font-bold mb-2">{children}</h3>
);

const AlertDescription = ({ children }) => (
  <p>{children}</p>
);

const questions = [
  {
    id: 1,
    text: "Are you currently a pharmacy business owner in Queensland?",
    options: ["Yes", "No"],
    explanation: "The new Pharmacy Business Ownership Act 2024 applies to all pharmacy businesses in Queensland. Existing owners will need to apply for a new licence.",
    nextQuestion: { Yes: 2, No: 11 }
  },
  {
    id: 2,
    text: "Are you a practising pharmacist with general registration?",
    options: ["Yes", "No"],
    explanation: "Under the new Act, only practising pharmacists with general registration can own a pharmacy business.",
    nextQuestion: { Yes: 3, No: 7 }
  },
  {
    id: 3,
    text: "Is your pharmacy business owned by a corporation, including as trustee?",
    options: ["Yes", "No"],
    explanation: "The new Act allows corporations to own pharmacies, including as trustees, but with specific restrictions on directors, shareholders, and beneficiaries.",
    nextQuestion: { Yes: 8, No: 4 }
  },
  {
    id: 4,
    text: "How many pharmacy businesses do you currently own or have an interest in?",
    options: ["1-5", "6 or more"],
    explanation: "The new Act limits the number of pharmacy businesses a person can have an interest in to 5 (or 6 for friendly societies).",
    nextQuestion: { "1-5": 5, "6 or more": 5 }
  },
  {
    id: 5,
    text: "Is your pharmacy located in or directly accessible from a supermarket?",
    options: ["Yes", "No"],
    explanation: "The new Act prohibits pharmacies from being located in or directly accessible from supermarkets, with some exceptions for existing businesses.",
    nextQuestion: { Yes: 6, No: 6 }
  },
  {
    id: 6,
    text: "Do you have any corporate shareholders, corporate beneficiaries, or any beneficiaries that are not the pharmacist, spouse, or adult child in your pharmacy business structure? (Note: all beneficiaries, including those covered by the trust deed definitions, despite not receiving distributions, are deemed to have a material interest)",
    options: ["Yes", "No"],
    explanation: "The new Act does not allow corporate shareholders or corporate beneficiaries in pharmacy business structures. Only pharmacists, their spouses, and adult children can be beneficiaries.",
    nextQuestion: { Yes: 9, No: 9 }
  },
  {
    id: 7,
    text: "Do you currently hold a non-practising registration as a pharmacist?",
    options: ["Yes", "No"],
    explanation: "The new Act requires pharmacy owners to have practising registration. Non-practising registrants have a 2-year transition period.",
    nextQuestion: { Yes: 4, No: 4 }
  },
  {
    id: 8,
    text: "Are all directors and shareholders of your pharmacy corporation practising pharmacists or close adult relatives of practising pharmacists?",
    options: ["Yes", "No"],
    explanation: "Under the new Act, all directors and shareholders of a pharmacy corporation must be practising pharmacists or their close adult relatives.",
    nextQuestion: { Yes: 4, No: 4 }
  },
  {
    id: 9,
    text: "Do you have any third-party agreements that control how you provide pharmacy services or restrict the types of medicines or health services you offer?",
    options: ["Yes", "No"],
    explanation: "The new Act prohibits certain forms of third-party control over pharmacy services and offerings.",
    nextQuestion: { Yes: 10, No: 10 }
  },
  {
    id: 10,
    text: "Is your Pharmacy Business licensed to a third party? Or is there some other arrangement where a person is not an owner but has another interest in the business that entitles them to receive consideration that varies according to the profits or takings of the business?",
    options: ["Yes", "No"],
    explanation: "The new Act prohibits certain third-party arrangements that involve profit-sharing or variable consideration based on the pharmacy's performance.",
    nextQuestion: { Yes: 11, No: 11 }
  },
  {
    id: 11,
    text: "Are you aware of the new licensing requirements under the Pharmacy Business Ownership Act 2024?",
    options: ["Yes", "No"],
    explanation: "The new Act introduces a licensing system for pharmacy businesses. All owners will need to apply for a licence.",
    nextQuestion: { Yes: null, No: null }
  }
];

const resourceLinks = {
  1: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation",
  2: "https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx",
  3: "https://www.legislation.qld.gov.au/view/html/asmade/act-2024-009",
  4: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#limit_pharmacies",
  5: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#supermarkets",
  6: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#corporate_shareholders",
  7: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#non_practising",
  8: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#eligibility",
  9: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#third_party_control",
  10: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#third_party_control",
  11: "https://www.health.qld.gov.au/system-governance/licences/pharmacy/pharmacy-ownership/new-pharmacy-business-ownership-legislation/information-for-pharmacy-owners#licensing"
};

const timeline = [
  { date: "28 March 2024", event: "Pharmacy Business Ownership Act 2024 receives assent" },
  { date: "Late 2024", event: "Expected establishment of Queensland Pharmacy Business Ownership Council" },
  { date: "Late 2025", event: "Expected commencement of licensing provisions" },
  { date: "Late 2026", event: "Deadline for existing owners to apply for a licence (1 year after commencement)" },
  { date: "Late 2027", event: "End of 2-year transition period for corporate shareholders and non-practising registrants" }
];

const PharmacyComplianceAdvisor = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [advice, setAdvice] = useState([]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    const nextQuestion = questions.find(q => q.id === currentQuestion).nextQuestion[answer];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
      setAdvice(getAdvice());
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(1);
    setAnswers({});
    setShowResults(false);
    setAdvice([]);
  };

  const getAdvice = () => {
    let advice = [];

    if (answers[1] === "Yes") {
      advice.push("As an existing pharmacy owner, you must apply for a new pharmacy business licence within one year from when the licensing provisions commence (expected late 2025).");
    }

    if (answers[2] === "No") {
      advice.push("To own a pharmacy business, you must be a practising pharmacist with general registration. Consider obtaining general registration or partnering with eligible pharmacists.");
    }

    if (answers[3] === "Yes" && answers[8] === "No") {
      advice.push("Ensure all directors and shareholders of your pharmacy corporation are practising pharmacists or close adult relatives of practising pharmacists. You may need to restructure your ownership.");
    }

    if (answers[4] === "6 or more") {
      advice.push("You exceed the maximum number of pharmacy businesses a person can have an interest in (5 for individuals, 6 for friendly societies). You'll need to divest some of your interests.");
    }

    if (answers[5] === "Yes") {
      advice.push("Your pharmacy's location in or directly accessible from a supermarket may not be compliant. You may need to relocate unless you qualify for the limited exception for existing businesses.");
    }

    if (answers[6] === "Yes") {
      advice.push("Corporate shareholders, corporate beneficiaries, and beneficiaries other than pharmacists, their spouses, and adult children are not permitted under the new Act. You have two years to restructure your ownership to comply.");
    }

    if (answers[7] === "Yes") {
      advice.push("You have two years from the commencement of the licensing provisions to change your registration to practising or to divest your pharmacy ownership.");
    }

    if (answers[9] === "Yes") {
      advice.push("Review and modify any third-party agreements that control pharmacy services or restrict offerings. These are prohibited under the new Act.");
    }

    if (answers[10] === "Yes") {
      advice.push("Review and modify any arrangements where non-owners receive consideration based on the pharmacy's profits or performance. These may be considered material interests and are restricted under the new Act.");
    }

    if (answers[11] === "No") {
      advice.push("Familiarize yourself with the new licensing requirements. You'll need to apply for a pharmacy business licence and comply with new regulations.");
    }

    if (advice.length === 0) {
      advice.push("Based on your answers, you appear to be largely compliant with the new Pharmacy Business Ownership Act 2024. However, stay informed about any updates or changes to the regulations.");
    }

    return advice;
  };

  const progress = (currentQuestion / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Ownership Compliance Advisor</h1>
      {!showResults ? (
        <>
          <Progress value={progress} className="w-full mb-4" />
          <h2 className="text-xl mb-2">Question {currentQuestion}</h2>
          <p className="mb-4">{questions.find(q => q.id === currentQuestion).text}</p>
          <div className="space-y-2">
            {questions.find(q => q.id === currentQuestion).options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-2 text-left border border-gray-300 rounded hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">Learn More</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Additional Information</DialogTitle>
                <DialogDescription>
                  {questions.find(q => q.id === currentQuestion).explanation}
                </DialogDescription>
              </DialogHeader>
              <Button asChild>
                <a href={resourceLinks[currentQuestion]} target="_blank" rel="noopener noreferrer">
                  View Official Resources
                </a>
              </Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Compliance Advice</h2>
          {advice.map((item, index) => (
            <Alert key={index} className="mb-4">
              <AlertTitle>Advice {index + 1}</AlertTitle>
              <AlertDescription>{item}</AlertDescription>
            </Alert>
          ))}
          <h3 className="text-lg font-bold mt-6 mb-2">Key Dates</h3>
          <ul className="space-y-2">
            {timeline.map((item, index) => (
              <li key={index} className="flex items-center">
                <Calendar className="mr-2" />
                <span className="font-semibold mr-2">{item.date}:</span>
                <span>{item.event}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button onClick={resetQuiz}>
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyComplianceAdvisor;