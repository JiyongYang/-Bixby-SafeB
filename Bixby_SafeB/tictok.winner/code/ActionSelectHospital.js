module.exports.function = function actionSelectHospital (results, order) {
  let hospital;
  if(order == "first"){
    hospital = results.hospital[0];
  }else if(order=="second"){
    hospital = results.hospital[1];
  }
  return hospital;
}
