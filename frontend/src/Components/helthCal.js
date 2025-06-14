
/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * @param {number} weight - Weight in kilograms.
 * @param {number} height - Height in centimeters.
 * @param {number} age - Age in years.
 * @param {string} gender - 'Nam' for male, 'Nữ' for female.
 * @returns {number} BMR in calories.
 */
export const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) {
        return 0; // Return 0 or throw an error if inputs are incomplete
    }

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseInt(age);

    let bmr = 0;
    if (gender === "Nam") {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5;
    } else if (gender === "Nữ") {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;
    }
    return bmr;
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 * @param {number} bmr - Basal Metabolic Rate in calories.
 * @param {string} activityLevel - Activity level ('Ít vận động', 'Vận động nhẹ', etc.).
 * @returns {number} TDEE in calories.
 */
export const calculateTDEE = (bmr, activityLevel) => {
    if (!bmr || !activityLevel) {
        return 0; // Return 0 or throw an error if inputs are incomplete
    }

    const activityFactorMap = {
        "Ít vận động": 1.2,
        "Vận động nhẹ": 1.375,
        "Vận động vừa": 1.55,
        "Vận động nhiều": 1.725,
        "Vận động rất nhiều": 1.9,
    };

    // Fallback to sedentary if activityLevel is not found
    const activityFactor = activityFactorMap[activityLevel] || 1.2;

    return bmr * activityFactor;
};