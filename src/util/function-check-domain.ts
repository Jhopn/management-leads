import * as dns from 'dns';
import { promisify } from 'util';

const resolveMxPromise = promisify(dns.resolveMx);

export async function checkDomain(email: string): Promise<void> {
  const domain = email.split('@')[1];

  if (!domain) {
    throw new Error('Invalid email format: no domain specified.');
  }

  try {
    const addresses = await resolveMxPromise(domain);

    if (!addresses || addresses.length === 0) {
      throw new Error('Email domain does not accept emails.');
    }

  } catch (error: any) {
    console.error(`DNS lookup failed for domain "${domain}":`, error.code);
    throw new Error('Email domain is invalid or does not exist.');
  }
}