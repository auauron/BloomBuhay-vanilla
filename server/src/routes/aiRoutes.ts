// server/src/routes/aiRoutes.ts
import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Test API on startup
async function testAI() {
    try {
        if (!apiKey) {
            console.log('❌ GEMINI_API_KEY/GOOGLE_API_KEY not found in environment variables');
            return false;
        }

        console.log('Testing Google AI API...');
        // Try multiple model names for compatibility
        const modelNames = ['gemini-2.5-flash'];
        
        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: "Hello, test" }] }]
                });
                
                await result.response; // ensure await is used
                console.log(`✅ Gemini API is working with ${modelName}!`);
                return true;
            } catch (modelError: unknown) {
                const msg = modelError instanceof Error ? modelError.message : String(modelError);
                console.log(`❌ ${modelName} failed: ${msg}`);
                continue;
            }
        }
        
        console.log('❌ All model attempts failed');
        return false;
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.log('❌ Gemini API failed:', msg);
        return false;
    }
}

// Test on module load
void testAI();

// BloomGuide AI endpoint
router.post('/bloomguide/ask', async (req, res) => {
    try {
        const { question, context = "general motherhood" } = req.body as { question?: string; context?: string };
        
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        if (!apiKey) {
            return res.json({
                success: true,
                response: getFallbackResponse(question, context),
                source: "fallback",
                note: "API key missing; using fallback"
            });
        }

        console.log(`BloomGuide AI request: ${question} [Context: ${context}]`);
        
        try {
            // Try different models for better compatibility
            const modelNames = ['gemini-2.5-flash'];
            let lastError: unknown;
            
            for (const modelName of modelNames) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    
                    const fullPrompt = `You are BloomGuide AI, a helpful and knowledgeable assistant for mothers and expecting mothers. \nProvide accurate, supportive, and practical information about ${context}.\n\nUser's question: "${question}"\n\nPlease respond with:\n1. A clear, concise answer to their specific question\n2. Practical advice or steps they can take\n3. When appropriate, mention when they should consult a healthcare professional\n4. Keep it warm, supportive, and mother-friendly\n5. Limit to 3-4 sentences maximum for brevity\n\nRemember: You're speaking to someone who might be tired, stressed, or seeking quick reliable information.`;

                    const result = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
                    });
                    
                    const response = await result.response;
                    const text = response.text();
                    
                    console.log(`✅ AI Response sent using ${modelName}`);
                    return res.json({
                        success: true,
                        response: text,
                        source: "gemini-ai",
                        model: modelName
                    });
                    
                } catch (modelError: unknown) {
                    lastError = modelError;
                    const msg = modelError instanceof Error ? modelError.message : String(modelError);
                    console.log(`❌ ${modelName} failed: ${msg}`);
                    continue;
                }
            }
            
            // If all models fail, use fallback
            const lastMsg = lastError instanceof Error ? lastError.message : String(lastError);
            throw new Error(`All models failed: ${lastMsg}`);
            
        } catch (aiError: unknown) {
            const msg = aiError instanceof Error ? aiError.message : String(aiError);
            console.log(`❌ AI API failed: ${msg}`);
            
            // Fallback responses
            const fallbackResponse = getFallbackResponse(question, context);
            return res.json({
                success: true,
                response: fallbackResponse,
                source: "fallback",
                note: "AI service temporarily unavailable, showing general advice"
            });
        }
        
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('AI Request failed:', msg);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            response: "I'm having trouble connecting right now. Please try again in a moment."
        });
    }
});

// Health check endpoint
router.get('/bloomguide/health', (_req, res) => {
    res.json({ 
        status: "healthy", 
        service: "BloomGuide AI",
        hasKey: !!apiKey,
        timestamp: new Date().toISOString()
    });
});

// Fallback response system
function getFallbackResponse(question: string, context: string): string {
    const questionLower = question.toLowerCase();
    
    // Pregnancy-related fallbacks
    if (questionLower.includes('morning sickness') || questionLower.includes('nausea')) {
        return "For morning sickness, try eating small, frequent meals and ginger tea. Avoid strong smells, and rest when you can. If vomiting is severe, contact your healthcare provider about safe medication options.";
    }
    
    if (questionLower.includes('sleep') || questionLower.includes('insomnia')) {
        return "Pregnancy sleep can be challenging. Try pregnancy pillows for support, establish a relaxing bedtime routine, and limit fluids before bed. If discomfort persists, discuss safe sleep aids with your doctor.";
    }
    
    if (questionLower.includes('nutrition') || questionLower.includes('eat')) {
        return "Focus on balanced meals with protein, whole grains, fruits and vegetables. Stay hydrated and include prenatal vitamins. Avoid raw fish, unpasteurized dairy, and limit caffeine.";
    }
    
    // Postpartum fallbacks
    if (questionLower.includes('recovery') || questionLower.includes('healing')) {
        return "Postpartum recovery takes time. Rest as much as possible, stay hydrated, and don't hesitate to ask for help. Watch for signs of infection and attend your postpartum checkups.";
    }
    
    if (questionLower.includes('breastfeeding') || questionLower.includes('nursing')) {
        return "For breastfeeding support, ensure proper latch, nurse frequently, and stay hydrated. Consider seeing a lactation consultant if you're experiencing pain or concerns about milk supply.";
    }
    
    // General fallback
    return "This is a great question about motherhood. For the most accurate and personalized advice, I recommend consulting with your healthcare provider who knows your specific situation. In the meantime, remember to take care of yourself too.";
}

export default router;