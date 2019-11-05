module.exports.function = function actionSelectShelter (results, order) {
  let shelter;
  if(order == "first"){
    shelter = results.shelter[0];
  }else if(order=="second"){
    shelter = results.shelter[1];
  }
  return shelter;
}
