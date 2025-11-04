/**
 * Berechnet den Body-Mass-Index (BMI)
 * @param weightKg Gewicht in Kilogramm
 * @param heightCm Größe in Zentimetern
 * @returns BMI-Wert
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg < 0) return 0
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

/**
 * Klassifiziert den BMI-Wert
 */
export function classifyBMI(bmi: number): {
  category: string
  color: string
  description: string
} {
  if (bmi < 18.5) {
    return {
      category: 'Untergewicht',
      color: 'text-blue-600',
      description: 'Du solltest möglicherweise etwas Gewicht zunehmen.'
    }
  } else if (bmi < 25) {
    return {
      category: 'Normalgewicht',
      color: 'text-green-600',
      description: 'Dein Gewicht ist im gesunden Bereich.'
    }
  } else if (bmi < 30) {
    return {
      category: 'Übergewicht',
      color: 'text-yellow-600',
      description: 'Es wäre sinnvoll, etwas Gewicht zu reduzieren.'
    }
  } else {
    return {
      category: 'Adipositas',
      color: 'text-red-600',
      description: 'Bitte konsultiere einen Arzt für eine gesunde Gewichtsreduktion.'
    }
  }
}

/**
 * Berechnet den geschätzten 1RM (One-Rep-Max) nach Epley-Formel
 * @param weightKg Gewicht in kg
 * @param reps Anzahl der Wiederholungen
 * @returns Geschätzter 1RM in kg
 */
export function calculate1RM(weightKg: number, reps: number): number {
  if (reps < 1 || weightKg <= 0) return 0
  if (reps === 1) return weightKg
  // Epley-Formel: 1RM = weight × (1 + reps / 30)
  return weightKg * (1 + reps / 30)
}

/**
 * Berechnet TDEE (Total Daily Energy Expenditure) nach Mifflin-St Jeor Equation
 * @param weightKg Gewicht in kg
 * @param heightCm Größe in cm
 * @param age Jahre
 * @param gender 'male' oder 'female'
 * @param activityLevel Aktivitätslevel (1.2 = sedentary, 1.375 = light, 1.55 = moderate, 1.725 = very active, 1.9 = extra active)
 * @returns TDEE in kcal/Tag
 */
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: number
): number {
  // BMR nach Mifflin-St Jeor
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }
  
  return Math.round(bmr * activityLevel)
}

/**
 * Aktivitätslevel-Optionen für TDEE
 */
export const activityLevels = [
  { value: 1.2, label: 'Sitzend (wenig Bewegung)', description: 'Büroarbeit, kein Training' },
  { value: 1.375, label: 'Leicht aktiv', description: '1-3 Tage Training pro Woche' },
  { value: 1.55, label: 'Mäßig aktiv', description: '3-5 Tage Training pro Woche' },
  { value: 1.725, label: 'Sehr aktiv', description: '6-7 Tage Training pro Woche' },
  { value: 1.9, label: 'Extrem aktiv', description: '2× täglich Training, körperliche Arbeit' },
]

