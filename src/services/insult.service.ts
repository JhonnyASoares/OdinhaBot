export function insult() {
  const xingamentos = [
    "Cala boca, seu preto de merda!",
    "Vai se ferrar, seu desgraçado!",
    "Você é uma piada ambulante!",
    "Nem sua mãe te aguenta, otário!",
    "Para de falar merda, imbecil!",
    "Tua existência já é um erro!",
    "Não é pq tu é obesa que o mundo gira em torno de você!",
    "Ninguém te chamou, palhaço!",
    "Sai daqui, seu abacaxi estragado!",
    "Cala essa boca cheia de bosta!",
    "Se eu quisesse ouvir merda, ia no esgoto!",
    "Se fosse pra ouvir besteira, eu falava com um pombo!",
    "Fala menos e pensa mais, anta!",
    "Falaria o mesmo se tivesse pai ausente!",
    "Nem o Google te aguenta mais!",
    "Se burrice fosse crime, tu pegava perpétua!",
    "Alguém te perguntou alguma coisa, idiota?",
    "Volta pro buraco de onde saiu, infeliz!",
    "Fala menos e some mais!",
    "Parabéns, conseguiu ser a vergonha da humanidade!",
    "Disse ele após beber água do ar-condicionado!",
    "E é assim que se farma aura de neandertal!",
    "Se eu quisesse ficar escutando mimimi eu comprava um gato gago",
  ];
  const insultRandom =
    xingamentos[Math.floor(Math.random() * xingamentos.length)];
  return insultRandom;
}
