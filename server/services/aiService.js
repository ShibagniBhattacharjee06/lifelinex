/**
 * AI Priority Scoring Engine
 * Rule-based scoring system to rank emergencies.
 */
exports.calculatePriority = (type, bloodGroup, medicalHistory) => {
    let score = 10; // Base score

    // 1. Emergency Type Weight
    switch (type) {
        case 'accident': score += 40; break;
        case 'surgery': score += 30; break;
        case 'disaster': score += 50; break; // Highest priority
        case 'blood_request': score += 20; break;
        default: score += 5;
    }

    // 2. Blood Rarity Weight (if known)
    if (bloodGroup) {
        if (['AB-', 'O-'].includes(bloodGroup)) score += 20; // Rarest
        else if (['B-', 'A-'].includes(bloodGroup)) score += 10;
        else score += 5;
    }

    // 3. Medical Conditions Parsing (Simple NLP-like keyword match)
    if (medicalHistory) {
        const history = medicalHistory.toLowerCase();
        if (history.includes('heart') || history.includes('cardiac')) score += 15;
        if (history.includes('diabetes') || history.includes('sugar')) score += 5;
        if (history.includes('asthma') || history.includes('breathing')) score += 10;
        if (history.includes('pregnant')) score += 25;
    }

    return Math.min(score, 100); // Max score 100
};
