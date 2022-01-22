const getQuestions = async () => {
  let datas = await fetch('../data/sampleQuestion.json');
  let questions = await datas.json();
  return questions;
};
