import { Allegiance, Role } from "../types";
import {
  DoctorIcon,
  InvestigatorIcon,
  JesterIcon,
  MafiosoIcon,
  TownieIcon,
  TransportIcon,
  VeteranIcon,
} from "./icons";

// TailwindCSS does not allow dynamic classnames
// therefore existing classnames must be used for color
export const TOWNS: Allegiance = {
  name: "Towns",
  color: "text-green-600",
};

export const MAFIA: Allegiance = {
  name: "Mafia",
  color: "text-red-600",
};

export const NEUTRAL: Allegiance = {
  name: "Neutral",
  color: "text-gray-600",
};

export const ROLES: Role[] = [
  {
    name: "Mafioso",
    iconSrc: MafiosoIcon,
    allegiance: MAFIA,
    description:
      "Kill someone each night until no one can stand in the way of the Mafia.",
  },
  {
    name: "Investigator",
    iconSrc: InvestigatorIcon,
    allegiance: TOWNS,
    description: "Investigate one person each night for a clue to their role.",
  },
  {
    name: "Townie",
    iconSrc: TownieIcon,
    allegiance: TOWNS,
    description: "You are an innocent member of the Town.",
  },
  {
    name: "Doctor",
    iconSrc: DoctorIcon,
    allegiance: TOWNS,
    description: "Heal one person each night, preventing them from dying.",
  },
  {
    name: "Veteran",
    iconSrc: VeteranIcon,
    allegiance: TOWNS,
    description:
      "Decide if you will go on alert on a certain night and kill anyone who visits you.",
  },
  {
    name: "Transporter",
    iconSrc: TransportIcon,
    allegiance: TOWNS,
    description: "Choose two people to transport at night.",
  },
  {
    name: "Jester",
    iconSrc: JesterIcon,
    allegiance: NEUTRAL,
    description: "Trick the Town into voting against you.",
  },
];
