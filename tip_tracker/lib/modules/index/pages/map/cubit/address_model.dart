class AddressModel {
  String? address1;
  String? address2;
  String? city;
  String? state;
  int? zip;

  AddressModel(this.address1, this.address2, this.city, this.state, this.zip);

  AddressModel.fromJson(dynamic json)
      : address1 = json["address1"],
        address2 = json["address2"],
        city = json["city"],
        state = json["state"],
        zip = int.tryParse(json["zip"]);

  Map<String, dynamic> toJson() => {
        "address1": address1,
        "address2": address2,
        "city": city,
        "state": state,
        "zip": zip,
      };
}
