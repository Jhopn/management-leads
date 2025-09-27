import * as dns from "dns";

export function checkDomain(email: string) {
  const domain = email.split("@")[1];
  dns.resolveMx(domain, (err, addresses) => {
    if (err || addresses.length === 0) {
      console.log("Domínio inválido ou sem servidor de e-mail.");
    } else {
      console.log("Domínio válido, MX encontrado:", addresses);
    }
  });
}
