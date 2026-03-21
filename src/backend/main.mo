actor {
  public type BirthdayInfo = {
    message : Text;
    day : Nat;
    month : Nat;
  };

  let birthdayInfo : BirthdayInfo = {
    message = "Happy Birthday, BFF!";
    day = 5;
    month = 4;
  };

  public query func getBirthdayInfo() : async BirthdayInfo {
    birthdayInfo;
  };
};
