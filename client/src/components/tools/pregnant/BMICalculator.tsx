import React, { useState } from "react";
import { Calculator, Scale, Ruler, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    if (!weight || !height) return;

    let weightInKg = parseFloat(weight);
    let heightInMeters = parseFloat(height);

    // Convert weight to kg if needed
    if (weightUnit === "lbs") {
      weightInKg = weightInKg * 0.453592;
    }

    // Convert height to meters if needed
    if (heightUnit === "cm") {
      heightInMeters = heightInMeters / 100;
    } else if (heightUnit === "ft") {
      // Convert feet and inches to meters
      const feet = Math.floor(heightInMeters);
      const inches = (heightInMeters - feet) * 100;
      heightInMeters = (feet * 0.3048) + (inches * 0.0254);
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: "Underweight", trend: "down", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (bmiValue < 25) return { category: "Healthy Weight", trend: "stable", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (bmiValue < 30) return { category: "Overweight", trend: "up", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { category: "Obese", trend: "up", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const getPregnancyRecommendation = (category: string) => {
    const recommendations = {
      Underweight: "Aim for 12.5-18 kg weight gain during pregnancy",
      "Healthy Weight": "Aim for 11.5-16 kg weight gain during pregnancy",
      Overweight: "Aim for 7-11.5 kg weight gain during pregnancy",
      Obese: "Aim for 5-9 kg weight gain during pregnancy"
    };
    return recommendations[category as keyof typeof recommendations];
  };

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-xl">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-bloomBlack">BMI Calculator</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-pink-200 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Enter Your Measurements
            </h4>

            <div className="space-y-4">
              {/* Weight Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                    placeholder="Enter weight"
                    step="0.1"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              {/* Height Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                    placeholder={heightUnit === "ft" ? "e.g., 5.6 for 5'6\"" : "Enter height"}
                    step="0.1"
                  />
                  <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-bloomPink focus:border-transparent"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
                {heightUnit === "ft" && (
                  <p className="text-sm text-gray-500 mt-1">Enter as feet.decimal (e.g., 5.6 for 5'6")</p>
                )}
              </div>

              <button
                onClick={calculateBMI}
                className="w-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white py-3 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate BMI
              </button>
            </div>
          </div>

          {/* BMI Chart */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">BMI Categories</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-gray-700">Underweight</span>
                <span className="text-sm font-semibold text-yellow-600">Below 18.5</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-sm text-gray-700">Healthy Weight</span>
                <span className="text-sm font-semibold text-green-600">18.5 - 24.9</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-sm text-gray-700">Overweight</span>
                <span className="text-sm font-semibold text-orange-600">25 - 29.9</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-sm text-gray-700">Obese</span>
                <span className="text-sm font-semibold text-red-600">30 and above</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {bmi && bmiCategory && (
            <>
              <div className={`rounded-2xl p-6 border ${bmiCategory.bg} ${bmiCategory.border}`}>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-gray-800 mb-2">{bmi}</div>
                  <div className="text-lg text-gray-600">Body Mass Index</div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {bmiCategory.trend === "up" && <TrendingUp className="w-5 h-5 text-orange-600" />}
                  {bmiCategory.trend === "down" && <TrendingDown className="w-5 h-5 text-yellow-600" />}
                  {bmiCategory.trend === "stable" && <Minus className="w-5 h-5 text-green-600" />}
                  <span className={`text-lg font-semibold ${bmiCategory.color}`}>
                    {bmiCategory.category}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-4 mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-bloomPink" />
                    Pregnancy Recommendation
                  </h5>
                  <p className="text-sm text-gray-700">
                    {getPregnancyRecommendation(bmiCategory.category)}
                  </p>
                </div>
              </div>

              {/* Health Tips */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Healthy Pregnancy Tips</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Eat balanced meals with plenty of fruits and vegetables</li>
                  <li>• Stay hydrated with 8-10 glasses of water daily</li>
                  <li>• Engage in moderate exercise like walking or prenatal yoga</li>
                  <li>• Attend all prenatal appointments</li>
                  <li>• Listen to your body's hunger and fullness cues</li>
                </ul>
              </div>
            </>
          )}

          {/* Empty State */}
          {!bmi && (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
              <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-700 mb-2">Calculate Your BMI</h4>
              <p className="text-gray-500 text-sm">
                Enter your weight and height to see your BMI results and pregnancy recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;