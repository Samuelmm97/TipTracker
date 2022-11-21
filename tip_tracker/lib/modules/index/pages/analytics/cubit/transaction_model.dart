import 'package:tip_tracker/modules/index/pages/map/cubit/location_model.dart';

class TransactionModel {
  int id;
  double? amount;
  LocationModel location;

  TransactionModel(this.id, this.amount, this.location);

  TransactionModel.fromJson(dynamic json)
      : id = json["id"],
        amount = double.tryParse(json["amount"]),
        location = LocationModel.fromJson(json["location"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "amount": amount,
        "location": location.toJson(),
      };
}
