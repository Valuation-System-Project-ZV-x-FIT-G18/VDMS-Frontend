/* Derives first name, last name, and name with initials from a full name.
   e.g. "Chaminda Prasad Senarathne" → firstName: "Chaminda",
   lastName: "Senarathne", initials: "C.P. Senarathne" */
export function deriveNames(fullName: string) {
  const parts = fullName.trim().split(/\s+/);  // split by whitespace
  if (parts.length === 0) return { firstName: '', lastName: '', nameWithInitials: '' };

  const firstName = parts[0];                  // first word
  const lastName = parts[parts.length - 1];    // last word

  // Build initials from all words except the last, then append last name
  const initials = parts.length > 1
    ? parts.slice(0, -1).map(w => w[0].toUpperCase() + '.').join('') + ' ' + lastName
    : firstName;

  return { firstName, lastName, nameWithInitials: initials };
}
