class PartyResult {
  constructor(name, electorates, party_vote) {
    this.name = name;
    this.electorate_seats = electorates;
    this.party_vote = party_vote;
    this.list_seats = 0;
    this.overhang = 0;

    this.entitlement = 0;
    this.divider = 1;
    this.quotient = 0;
  }

  qualifiesForList() {
    // If we already have entitlement this result has already been run
    return this.entitlement == 0 && (this.party_vote >= 0.05 || this.electorate_seats > 0);
  }

  increment_entitlement() {
    this.entitlement += 1;
    this.divider += 2;
  }

  setListSeats(num) {
    if (num >= 0) {
      this.list_seats = num;
    } else {
      this.overhang = num * -1;
    }
  }

  getTotalSeats() {
    return this.electorate_seats + this.list_seats;
  }
}

class Result {
  constructor(party_results, electorates, total_seats) {
    this.party_results = party_results;
    this.electorates = electorates;
    this.total_seats = total_seats;
    this.list_seats = total_seats - electorates;
  }

  getPartyOrder() {
    // HACK: just define results in left-to-right display order
    return this.party_results;
  }
}

const historic_results = {
  "2026 Preliminary": new Result([
    new PartyResult("LAB", 21, 0.2936),
    new PartyResult("GRN", 2, 0.1330),
    new PartyResult("TPM", 5, 0.0057),
    new PartyResult("OPP", 0, 0.0596),
    new PartyResult("NZF", 0, 0.0978),
    new PartyResult("ACT", 1, 0.1092),
    new PartyResult("NAT", 42, 0.2921),
    ], 71, 120),
  "2023 Election": new Result([
    new PartyResult("LAB", 17, 0.2691),
    new PartyResult("GRN", 3, 0.1160),
    new PartyResult("TPM", 6, 0.0308),
    new PartyResult("OPP", 0, 0.0222),
    new PartyResult("NZF", 0, 0.0608),
    new PartyResult("ACT", 2, 0.1092),
    new PartyResult("NAT", 43, 0.3806),
    ], 71, 120),
  "2020 Election": new Result([
    new PartyResult("LAB", 46, 0.500),
    new PartyResult("GRN", 1, 0.079),
    new PartyResult("TPM", 1, 0.012),
    new PartyResult("OPP", 0, 0.015),
    new PartyResult("NZF", 0, 0.026),
    new PartyResult("ACT", 1, 0.076),
    new PartyResult("NAT", 23, 0.256),
    ], 72, 120),
}

const historic_polls = {
  "2026": {
    "TPU-Curia 1-3 Sep": new Result([
      new PartyResult("LAB", 0, 0.259),
      new PartyResult("GRN", 0, 0.139),
      new PartyResult("TPM", 0, 0.020),
      new PartyResult("OPP", 0, 0.045),
      new PartyResult("NZF", 0, 0.084),
      new PartyResult("ACT", 0, 0.105),
      new PartyResult("NAT", 0, 0.290),
      ], 0, 120),
    "Anacta 4-10 Sep": new Result([
      new PartyResult("LAB", 0, 0.310),
      new PartyResult("GRN", 0, 0.120),
      new PartyResult("TPM", 0, 0.020),
      new PartyResult("OPP", 0, 0.070),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.080),
      new PartyResult("NAT", 0, 0.300),
      ], 0, 120),
    "The Post-Freshwater 4-11 Sep": new Result([
      new PartyResult("LAB", 1, 0.280),
      new PartyResult("GRN", 1, 0.136),
      new PartyResult("TPM", 1, 0.022),
      new PartyResult("OPP", 0, 0.063),
      new PartyResult("NZF", 1, 0.126),
      new PartyResult("ACT", 1, 0.087),
      new PartyResult("NAT", 1, 0.265),
      ], 0, 120),
    "1News-Verian 23-27 Sep": new Result([
      new PartyResult("LAB", 0, 0.280),
      new PartyResult("GRN", 0, 0.160),
      new PartyResult("TPM", 4, 0.012),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.060),
      new PartyResult("NZF", 0, 0.090),
      new PartyResult("ACT", 0, 0.110),
      new PartyResult("NAT", 0, 0.280),
      ], 0, 120),
    "Roy Morgan 31 Aug - 27 Sep": new Result([
      new PartyResult("LAB", 0, 0.235),
      new PartyResult("GRN", 0, 0.160),
      new PartyResult("TPM", 0, 0.020),
      new PartyResult("OPP", 0, 0.065),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.110),
      new PartyResult("NAT", 0, 0.310),
      ], 0, 120),
    "RNZ-Reid Research 24 Sep - 1 Oct": new Result([
      new PartyResult("LAB", 1, 0.308),
      new PartyResult("GRN", 1, 0.148),
      new PartyResult("TPM", 1, 0.020),
      new PartyResult("OPP", 0, 0.055),
      new PartyResult("NZF", 1, 0.106),
      new PartyResult("ACT", 1, 0.090),
      new PartyResult("NAT", 1, 0.259),
      ], 0, 120),
    "1News-Verian 1-5 Oct": new Result([
      new PartyResult("LAB", 0, 0.280),
      new PartyResult("GRN", 0, 0.160),
      new PartyResult("TPM", 4, 0.006),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.070),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.090),
      new PartyResult("NAT", 0, 0.290),
      ], 0, 120),
    "TPU-Curia 1-5 Oct": new Result([
      new PartyResult("LAB", 0, 0.282),
      new PartyResult("GRN", 0, 0.133),
      new PartyResult("TPM", 0, 0.014),
      new PartyResult("OPP", 0, 0.048),
      new PartyResult("NZF", 0, 0.120),
      new PartyResult("ACT", 0, 0.092),
      new PartyResult("NAT", 0, 0.285),
      ], 0, 120),
    "Anacta 6-10 Oct": new Result([
      new PartyResult("LAB", 0, 0.290),
      new PartyResult("GRN", 0, 0.150),
      new PartyResult("TPM", 0, 0.020),
      new PartyResult("OPP", 0, 0.050),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.090),
      new PartyResult("NAT", 0, 0.280),
      ], 0, 120),
    "1News-Verian 8-12 Oct": new Result([
      new PartyResult("LAB", 0, 0.280),
      new PartyResult("GRN", 0, 0.150),
      new PartyResult("TPM", 4, 0.004),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.080),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.100),
      new PartyResult("NAT", 0, 0.280),
      ], 0, 120),
    "The Post-Freshwater 9-19 Oct": new Result([
      new PartyResult("LAB", 1, 0.287),
      new PartyResult("GRN", 1, 0.143),
      new PartyResult("TPM", 1, 0.020),
      new PartyResult("OPP", 0, 0.054),
      new PartyResult("NZF", 1, 0.118),
      new PartyResult("ACT", 1, 0.090),
      new PartyResult("NAT", 1, 0.276),
      ], 0, 120),
    "1News-Verian 15-19 Oct": new Result([
      new PartyResult("LAB", 0, 0.270),
      new PartyResult("GRN", 0, 0.160),
      new PartyResult("TPM", 4, 0.007),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.070),
      new PartyResult("NZF", 0, 0.080),
      new PartyResult("ACT", 0, 0.110),
      new PartyResult("NAT", 0, 0.320),
      ], 0, 120),
    "1News-Verian 21-25 Oct": new Result([
      new PartyResult("LAB", 0, 0.270),
      new PartyResult("GRN", 0, 0.150),
      new PartyResult("TPM", 4, 0.001),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.060),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.120),
      new PartyResult("NAT", 0, 0.290),
      ], 0, 120),
    "Roy Morgan 31 Aug - 27 Sep": new Result([
      new PartyResult("LAB", 0, 0.275),
      new PartyResult("GRN", 0, 0.155),
      new PartyResult("TPM", 0, 0.010),
      new PartyResult("OPP", 0, 0.080),
      new PartyResult("NZF", 0, 0.100),
      new PartyResult("ACT", 0, 0.110),
      new PartyResult("NAT", 0, 0.265),
      ], 0, 120),
    "RNZ-Reid Research 20-26 Oct": new Result([
      new PartyResult("LAB", 1, 0.306),
      new PartyResult("GRN", 1, 0.145),
      new PartyResult("TPM", 1, 0.019),
      new PartyResult("OPP", 0, 0.072),
      new PartyResult("NZF", 1, 0.099),
      new PartyResult("ACT", 1, 0.101),
      new PartyResult("NAT", 1, 0.248),
      ], 0, 120),
    "1News-Verian 29 Oct - 2 Nov": new Result([
      new PartyResult("LAB", 0, 0.288),
      new PartyResult("GRN", 0, 0.164),
      new PartyResult("TPM", 4, 0.004),
      new PartyResult("TTT", 1, 0.000),
      new PartyResult("OPP", 0, 0.062),
      new PartyResult("NZF", 0, 0.084),
      new PartyResult("ACT", 0, 0.100),
      new PartyResult("NAT", 0, 0.295),
      ], 0, 120),
    "TPU-Curia 28 Oct - 3 Nov": new Result([
      new PartyResult("LAB", 0, 0.284),
      new PartyResult("GRN", 0, 0.144),
      new PartyResult("TPM", 0, 0.011),
      new PartyResult("OPP", 0, 0.058),
      new PartyResult("NZF", 0, 0.098),
      new PartyResult("ACT", 0, 0.105),
      new PartyResult("NAT", 0, 0.289),
      ], 0, 120),
    "The Post-Freshwater 28 Oct - 4 Nov": new Result([
      new PartyResult("LAB", 1, 0.307),
      new PartyResult("GRN", 1, 0.130),
      new PartyResult("TPM", 1, 0.020),
      new PartyResult("OPP", 0, 0.051),
      new PartyResult("NZF", 1, 0.120),
      new PartyResult("ACT", 1, 0.098),
      new PartyResult("NAT", 1, 0.264),
      ], 0, 120),
  },
}

const colours = {
  "ACT": "#FDE401",
  "GRN": "#098137",
  "LAB": "#D82A20",
  "TPM": "#B2001A",
  "NAT": "#00529F",
  "NZF": "#000000",
  "OPP": "#00EDE1",
  "TTT": "#734930",
}

const blocs = {
  "ACT": 1,
  "GRN": 0,
  "LAB": 0,
  "NAT": 1,
  "NZF": 1,
  "OPP": 0,
  "TPM": 0,
  "TTT": 0,
}