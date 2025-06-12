
declare interface ElectionCandidate {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

declare interface ElectionRole {
  id: string;
  title: string;
  category: "Leadership" | "House Captains";
  candidates: ElectionCandidate[];
}

declare interface VoteRecord {
  id: string;
  studentId: string;
  roleId: string;
  candidateId: string;
  timestamp: string;
  confirmationCode: string;
}

declare interface ElectionResult {
  id: string;
  title: string;
  candidates: {
    id: string;
    name: string;
    votes: number;
  }[];
  totalVotes: number;
}

declare interface AuditLogEntry {
  id: number;
  timestamp: string;
  anonymizedId: string;
  role: string;
  action: string;
}
