import { NextResponse } from 'next/server';

// Sample quiz questions database
const quizQuestions = {
  easy: [
    {
      id: 1,
      text: "Hello, how are you?",
      options: ["Hola, ¿cómo estás?", "Adiós, ¿cómo estás?", "Hola, ¿dónde estás?", "Hola, ¿quién eres?"],
      correctAnswer: "Hola, ¿cómo estás?",
      translation: "Hola, ¿cómo estás?"
    },
    {
      id: 2,
      text: "My name is John",
      options: ["Me llamo John", "Mi nombre es Juan", "Yo soy John", "Me gusta John"],
      correctAnswer: "Me llamo John",
      translation: "Me llamo John"
    },
    {
      id: 3,
      text: "I like to read books",
      options: ["Me gusta leer libros", "Me gusta escribir libros", "Quiero leer libros", "Tengo muchos libros"],
      correctAnswer: "Me gusta leer libros",
      translation: "Me gusta leer libros"
    },
    {
      id: 4,
      text: "What time is it?",
      options: ["¿Qué hora es?", "¿Qué tiempo hace?", "¿Cuándo es?", "¿Dónde está el reloj?"],
      correctAnswer: "¿Qué hora es?",
      translation: "¿Qué hora es?"
    },
    {
      id: 5,
      text: "I am hungry",
      options: ["Tengo hambre", "Tengo sed", "Estoy cansado", "Estoy enfermo"],
      correctAnswer: "Tengo hambre",
      translation: "Tengo hambre"
    },
    {
      id: 6,
      text: "Where is the bathroom?",
      options: ["¿Dónde está el baño?", "¿Dónde está la cocina?", "¿Dónde está el dormitorio?", "¿Dónde está la puerta?"],
      correctAnswer: "¿Dónde está el baño?",
      translation: "¿Dónde está el baño?"
    },
    {
      id: 7,
      text: "I need help",
      options: ["Necesito ayuda", "Quiero ayudar", "Puedo ayudar", "No necesito ayuda"],
      correctAnswer: "Necesito ayuda",
      translation: "Necesito ayuda"
    },
    {
      id: 8,
      text: "Thank you very much",
      options: ["Muchas gracias", "De nada", "Por favor", "Lo siento mucho"],
      correctAnswer: "Muchas gracias",
      translation: "Muchas gracias"
    },
    {
      id: 9,
      text: "I don't understand",
      options: ["No entiendo", "No comprendo", "No sé", "No hablo español"],
      correctAnswer: "No entiendo",
      translation: "No entiendo"
    },
    {
      id: 10,
      text: "Good morning",
      options: ["Buenos días", "Buenas tardes", "Buenas noches", "Buen día"],
      correctAnswer: "Buenos días",
      translation: "Buenos días"
    }
  ],
  medium: [
    {
      id: 1,
      text: "I would like to order a coffee with milk",
      options: ["Me gustaría pedir un café con leche", "Quiero un café negro", "Necesito un té con leche", "Voy a tomar un refresco"],
      correctAnswer: "Me gustaría pedir un café con leche",
      translation: "Me gustaría pedir un café con leche"
    },
    {
      id: 2,
      text: "Could you recommend a good restaurant nearby?",
      options: ["¿Podría recomendarme un buen restaurante cerca?", "¿Hay algún restaurante bueno por aquí?", "¿Dónde está el restaurante más cercano?", "¿Le gusta este restaurante?"],
      correctAnswer: "¿Podría recomendarme un buen restaurante cerca?",
      translation: "¿Podría recomendarme un buen restaurante cerca?"
    },
    {
      id: 3,
      text: "I've been studying Spanish for two years",
      options: ["He estado estudiando español durante dos años", "Estudié español hace dos años", "Voy a estudiar español por dos años", "Estudio español desde hace dos semanas"],
      correctAnswer: "He estado estudiando español durante dos años",
      translation: "He estado estudiando español durante dos años"
    },
    {
      id: 4,
      text: "What do you do for a living?",
      options: ["¿A qué te dedicas?", "¿Dónde vives?", "¿Cuántos años tienes?", "¿Cómo te llamas?"],
      correctAnswer: "¿A qué te dedicas?",
      translation: "¿A qué te dedicas?"
    },
    {
      id: 5,
      text: "I'm sorry, I'm running late",
      options: ["Lo siento, llego tarde", "Perdón, estoy ocupado", "Disculpa, no puedo ir", "Lo siento, me tengo que ir"],
      correctAnswer: "Lo siento, llego tarde",
      translation: "Lo siento, llego tarde"
    },
    {
      id: 6,
      text: "Could you speak more slowly, please?",
      options: ["¿Podría hablar más despacio, por favor?", "¿Puede repetir eso, por favor?", "¿Qué ha dicho?", "No entiendo lo que dice"],
      correctAnswer: "¿Podría hablar más despacio, por favor?",
      translation: "¿Podría hablar más despacio, por favor?"
    },
    {
      id: 7,
      text: "I'm looking for the train station",
      options: ["Estoy buscando la estación de tren", "Necesito ir a la estación de autobuses", "¿Dónde está el aeropuerto?", "Quiero ir al puerto"],
      correctAnswer: "Estoy buscando la estación de tren",
      translation: "Estoy buscando la estación de tren"
    },
    {
      id: 8,
      text: "How much does this cost?",
      options: ["¿Cuánto cuesta esto?", "¿Qué precio tiene?", "¿Es caro o barato?", "¿Acepta tarjetas de crédito?"],
      correctAnswer: "¿Cuánto cuesta esto?",
      translation: "¿Cuánto cuesta esto?"
    },
    {
      id: 9,
      text: "I'd like to make a reservation for two people",
      options: ["Me gustaría hacer una reserva para dos personas", "Necesito una mesa para dos", "¿Tienen mesa para dos?", "Somos dos personas"],
      correctAnswer: "Me gustaría hacer una reserva para dos personas",
      translation: "Me gustaría hacer una reserva para dos personas"
    },
    {
      id: 10,
      text: "What time does the museum open?",
      options: ["¿A qué hora abre el museo?", "¿Cuándo cierra el museo?", "¿Dónde está el museo?", "¿Cuánto cuesta la entrada al museo?"],
      correctAnswer: "¿A qué hora abre el museo?",
      translation: "¿A qué hora abre el museo?"
    },
    {
      id: 11,
      text: "I've lost my passport",
      options: ["He perdido mi pasaporte", "Necesito un pasaporte nuevo", "¿Dónde está la embajada?", "Mi pasaporte ha caducado"],
      correctAnswer: "He perdido mi pasaporte",
      translation: "He perdido mi pasaporte"
    },
    {
      id: 12,
      text: "Could you help me find my hotel?",
      options: ["¿Podría ayudarme a encontrar mi hotel?", "¿Sabe dónde está este hotel?", "Estoy buscando un hotel", "¿Hay algún hotel cerca?"],
      correctAnswer: "¿Podría ayudarme a encontrar mi hotel?",
      translation: "¿Podría ayudarme a encontrar mi hotel?"
    },
    {
      id: 13,
      text: "I need to buy some souvenirs",
      options: ["Necesito comprar algunos recuerdos", "Quiero ir de compras", "¿Dónde puedo comprar regalos?", "Busco una tienda de regalos"],
      correctAnswer: "Necesito comprar algunos recuerdos",
      translation: "Necesito comprar algunos recuerdos"
    },
    {
      id: 14,
      text: "What's the weather forecast for tomorrow?",
      options: ["¿Cuál es el pronóstico del tiempo para mañana?", "¿Qué tiempo hace hoy?", "¿Va a llover mañana?", "¿Hace calor o frío?"],
      correctAnswer: "¿Cuál es el pronóstico del tiempo para mañana?",
      translation: "¿Cuál es el pronóstico del tiempo para mañana?"
    },
    {
      id: 15,
      text: "I'd like to exchange some currency",
      options: ["Me gustaría cambiar algo de dinero", "Necesito sacar dinero", "¿Dónde hay un banco?", "¿Aceptan dólares?"],
      correctAnswer: "Me gustaría cambiar algo de dinero",
      translation: "Me gustaría cambiar algo de dinero"
    }
  ],
  hard: [
    {
      id: 1,
      text: "I wish I had studied more languages when I was younger",
      options: ["Ojalá hubiera estudiado más idiomas cuando era más joven", "Debería haber estudiado más idiomas de joven", "Estudiaré más idiomas cuando sea mayor", "Me arrepiento de no estudiar idiomas"],
      correctAnswer: "Ojalá hubiera estudiado más idiomas cuando era más joven",
      translation: "Ojalá hubiera estudiado más idiomas cuando era más joven"
    },
    {
      id: 2,
      text: "If I were you, I would take that job opportunity abroad",
      options: ["Si yo fuera tú, aceptaría esa oportunidad de trabajo en el extranjero", "Deberías aceptar ese trabajo en el extranjero", "Yo aceptaría ese trabajo si pudiera", "Es una buena oportunidad para trabajar en el extranjero"],
      correctAnswer: "Si yo fuera tú, aceptaría esa oportunidad de trabajo en el extranjero",
      translation: "Si yo fuera tú, aceptaría esa oportunidad de trabajo en el extranjero"
    },
    {
      id: 3,
      text: "By the time we arrive, the movie will have already started",
      options: ["Para cuando lleguemos, la película ya habrá empezado", "Llegaremos tarde a la película", "La película empieza antes de que lleguemos", "No llegaremos a tiempo para la película"],
      correctAnswer: "Para cuando lleguemos, la película ya habrá empezado",
      translation: "Para cuando lleguemos, la película ya habrá empezado"
    },
    {
      id: 4,
      text: "Despite having lived here for years, I still get lost sometimes",
      options: ["A pesar de haber vivido aquí durante años, todavía me pierdo a veces", "Aunque vivo aquí desde hace años, a veces me pierdo", "He vivido aquí muchos años pero no conozco bien la ciudad", "Sigo perdiéndome aunque llevo años viviendo aquí"],
      correctAnswer: "A pesar de haber vivido aquí durante años, todavía me pierdo a veces",
      translation: "A pesar de haber vivido aquí durante años, todavía me pierdo a veces"
    },
    {
      id: 5,
      text: "Had I known about the traffic, I would have left earlier",
      options: ["Si hubiera sabido lo del tráfico, habría salido antes", "No sabía que había tanto tráfico", "Debería haber salido antes por el tráfico", "La próxima vez saldré más temprano"],
      correctAnswer: "Si hubiera sabido lo del tráfico, habría salido antes",
      translation: "Si hubiera sabido lo del tráfico, habría salido antes"
    },
    {
      id: 6,
      text: "Not only did she learn Spanish, but she also became fluent in Portuguese",
      options: ["No solo aprendió español, sino que también llegó a hablar portugués con fluidez", "Aprendió español y portugués", "Habla español mejor que portugués", "Primero aprendió español y luego portugués"],
      correctAnswer: "No solo aprendió español, sino que también llegó a hablar portugués con fluidez",
      translation: "No solo aprendió español, sino que también llegó a hablar portugués con fluidez"
    },
    {
      id: 7,
      text: "The more I practice speaking, the more confident I become",
      options: ["Cuanto más practico hablando, más confianza adquiero", "Practicar hablar me da más confianza", "Me siento más seguro cuando practico", "Necesito practicar más para tener confianza"],
      correctAnswer: "Cuanto más practico hablando, más confianza adquiero",
      translation: "Cuanto más practico hablando, más confianza adquiero"
    },
    {
      id: 8,
      text: "She suggested that we should hire a professional translator for the conference",
      options: ["Ella sugirió que contratáramos a un traductor profesional para la conferencia", "Según ella, necesitamos un traductor para la conferencia", "Ella quiere ser la traductora en la conferencia", "La conferencia requiere un traductor profesional"],
      correctAnswer: "Ella sugirió que contratáramos a un traductor profesional para la conferencia",
      translation: "Ella sugirió que contratáramos a un traductor profesional para la conferencia"
    },
    {
      id: 9,
      text: "I would rather have gone to the language exchange than stayed at home",
      options: ["Hubiera preferido ir al intercambio de idiomas en vez de quedarme en casa", "Prefiero ir al intercambio de idiomas que quedarme en casa", "Me arrepiento de no haber ido al intercambio de idiomas", "La próxima vez iré al intercambio de idiomas"],
      correctAnswer: "Hubiera preferido ir al intercambio de idiomas en vez de quedarme en casa",
      translation: "Hubiera preferido ir al intercambio de idiomas en vez de quedarme en casa"
    },
    {
      id: 10,
      text: "It's high time we addressed the issue of language preservation",
      options: ["Ya es hora de que abordemos el tema de la preservación de las lenguas", "Debemos preservar las lenguas", "La preservación de las lenguas es importante", "Es urgente preservar las lenguas"],
      correctAnswer: "Ya es hora de que abordemos el tema de la preservación de las lenguas",
      translation: "Ya es hora de que abordemos el tema de la preservación de las lenguas"
    },
    {
      id: 11,
      text: "Were it not for my Spanish teacher, I would never have become fluent",
      options: ["De no ser por mi profesor de español, nunca habría llegado a hablar con fluidez", "Gracias a mi profesor de español, hablo con fluidez", "Mi profesor de español me ayudó mucho", "Aprendí español gracias a mi profesor"],
      correctAnswer: "De no ser por mi profesor de español, nunca habría llegado a hablar con fluidez",
      translation: "De no ser por mi profesor de español, nunca habría llegado a hablar con fluidez"
    },
    {
      id: 12,
      text: "Scarcely had I begun to speak when I realized I was using the wrong language",
      options: ["Apenas había empezado a hablar cuando me di cuenta de que estaba usando el idioma incorrecto", "Empecé a hablar en el idioma equivocado", "Me confundí de idioma al empezar a hablar", "No me di cuenta de que estaba hablando en el idioma equivocado"],
      correctAnswer: "Apenas había empezado a hablar cuando me di cuenta de que estaba usando el idioma incorrecto",
      translation: "Apenas había empezado a hablar cuando me di cuenta de que estaba usando el idioma incorrecto"
    },
    {
      id: 13,
      text: "No matter how much I study, there are always new words to learn",
      options: ["Por mucho que estudie, siempre hay palabras nuevas que aprender", "Siempre hay palabras nuevas para aprender", "Nunca se termina de aprender palabras nuevas", "Estudiar mucho no garantiza aprender todas las palabras"],
      correctAnswer: "Por mucho que estudie, siempre hay palabras nuevas que aprender",
      translation: "Por mucho que estudie, siempre hay palabras nuevas que aprender"
    },
    {
      id: 14,
      text: "Should you need any assistance with translation, don't hesitate to ask",
      options: ["Si necesitara ayuda con la traducción, no dude en preguntar", "Puede pedir ayuda con la traducción", "Estoy disponible para ayudar con traducciones", "Pregunte si necesita ayuda con la traducción"],
      correctAnswer: "Si necesitara ayuda con la traducción, no dude en preguntar",
      translation: "Si necesitara ayuda con la traducción, no dude en preguntar"
    },
    {
      id: 15,
      text: "Not until you immerse yourself in a language do you truly begin to understand its nuances",
      options: ["No es hasta que te sumerges en un idioma que realmente empiezas a entender sus matices", "Hay que sumergirse en un idioma para entender sus matices", "Los matices de un idioma solo se entienden con la inmersión", "La inmersión es la mejor manera de entender un idioma"],
      correctAnswer: "No es hasta que te sumerges en un idioma que realmente empiezas a entender sus matices",
      translation: "No es hasta que te sumerges en un idioma que realmente empiezas a entender sus matices"
    },
    {
      id: 16,
      text: "The book to which I was referring has been translated into twelve languages",
      options: ["El libro al que me refería ha sido traducido a doce idiomas", "Me refería a un libro traducido a doce idiomas", "Hay un libro que ha sido traducido a doce idiomas", "El libro que mencioné está disponible en doce idiomas"],
      correctAnswer: "El libro al que me refería ha sido traducido a doce idiomas",
      translation: "El libro al que me refería ha sido traducido a doce idiomas"
    },
    {
      id: 17,
      text: "Little did I know that learning a new language would change my perspective on life",
      options: ["Poco sabía yo que aprender un nuevo idioma cambiaría mi perspectiva sobre la vida", "No sabía que aprender un idioma cambiaría mi vida", "Aprender un nuevo idioma cambió mi perspectiva", "Un nuevo idioma puede cambiar tu perspectiva de vida"],
      correctAnswer: "Poco sabía yo que aprender un nuevo idioma cambiaría mi perspectiva sobre la vida",
      translation: "Poco sabía yo que aprender un nuevo idioma cambiaría mi perspectiva sobre la vida"
    },
    {
      id: 18,
      text: "Rarely have I encountered someone who speaks so many languages fluently",
      options: ["Raramente he encontrado a alguien que hable tantos idiomas con fluidez", "Es raro encontrar a alguien que hable muchos idiomas", "Pocas personas hablan tantos idiomas con fluidez", "No es común hablar tantos idiomas con fluidez"],
      correctAnswer: "Raramente he encontrado a alguien que hable tantos idiomas con fluidez",
      translation: "Raramente he encontrado a alguien que hable tantos idiomas con fluidez"
    },
    {
      id: 19,
      text: "Only after living in Spain for a year did I truly appreciate the subtleties of the language",
      options: ["Solo después de vivir en España durante un año aprecié realmente las sutilezas del idioma", "Viví en España un año para aprender el idioma", "Las sutilezas del español se aprenden viviendo en España", "Un año en España me enseñó las sutilezas del idioma"],
      correctAnswer: "Solo después de vivir en España durante un año aprecié realmente las sutilezas del idioma",
      translation: "Solo después de vivir en España durante un año aprecié realmente las sutilezas del idioma"
    },
    {
      id: 20,
      text: "Had I the opportunity, I would travel the world to practice all the languages I've studied",
      options: ["Si tuviera la oportunidad, viajaría por el mundo para practicar todos los idiomas que he estudiado", "Me gustaría viajar para practicar idiomas", "Viajar es la mejor manera de practicar idiomas", "Estudiar idiomas te permite viajar por el mundo"],
      correctAnswer: "Si tuviera la oportunidad, viajaría por el mundo para practicar todos los idiomas que he estudiado",
      translation: "Si tuviera la oportunidad, viajaría por el mundo para practicar todos los idiomas que he estudiado"
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty') || 'easy';
  const limit = parseInt(searchParams.get('limit') || '10');
  
  // Get questions for the specified difficulty
  const questions = quizQuestions[difficulty as keyof typeof quizQuestions] || [];
  
  // Shuffle and limit the number of questions
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(limit, shuffled.length));
  
  return NextResponse.json({ questions: selected });
}
