import { randomBytes, secretbox } from 'tweetnacl';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
import { storedWallet, EMPTY_WALLET } from '../stores/globalStore'
import pbkdf2 from 'pbkdf2';

const EXPIRATION_TIME_MS = 60 * 60 * 1000;

export function normalizeMnemonic(mnemonic) {
  return mnemonic.trim().split(/\s+/g).join(" ");
}

export function validateMnemonic(mnemonic) {
  return bip39.validateMnemonic(mnemonic);
}

export async function generateMnemonicAndSeed() {
  const bip39 = await import('bip39');
  const mnemonic = bip39.generateMnemonic(256);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return { mnemonic, seed: Buffer.from(seed).toString('hex') };
}

export async function mnemonicToSeed(mnemonic) {
  const bip39 = await import('bip39');
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid seed words');
  }
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return Buffer.from(seed).toString('hex');
}


let unlockedWallet = (() => {
  const unlockedExpiration = sessionStorage.getItem('unlockedExpiration') || localStorage.getItem('unlockedExpiration');
  // Left here to clean up stored mnemonics from previous method
  if (unlockedExpiration && Number(unlockedExpiration) < Date.now()) {
    localStorage.removeItem('unlocked');
    localStorage.removeItem('unlockedExpiration');
    sessionStorage.removeItem('unlocked');
    sessionStorage.removeItem('unlockedExpiration');
  }
  const stored = JSON.parse(
    sessionStorage.getItem('unlocked') ||
      localStorage.getItem('unlocked') ||
      'null',
  );
  if (stored === null || stored.vk === null) {
    return EMPTY_WALLET;
  }
  return stored;
})();

setTimeout(()=>{
  storedWallet.set(unlockedWallet);
}, 100);

function setUnlockedWallet(
  wallet
) {
  unlockedWallet = wallet;
  storedWallet.set(wallet);
  unlocked = JSON.stringify(wallet);
  if (wallet === EMPTY_WALLET) {
    localStorage.removeItem('unlocked');
    sessionStorage.removeItem('unlocked');
    localStorage.removeItem('unlockedExpiration');
    sessionStorage.removeItem('unlockedExpiration'); 
  } else {
    localStorage.setItem('unlocked', unlocked);
    sessionStorage.setItem('unlocked', unlocked);
    let expiration = Date.now()+EXPIRATION_TIME_MS;
    localStorage.setItem('unlockedExpiration', expiration);
    sessionStorage.setItem('unlockedExpiration', expiration);  
  }
}

export async function storeWallet(
  wallet,
  password,
) {
  const plaintext = JSON.stringify(wallet);
  if (password) {
    const salt = randomBytes(16);
    const kdf = 'pbkdf2';
    const iterations = 100000;
    const digest = 'SHA256';
    const key = deriveEncryptionKey(password, salt, iterations, digest);
    const nonce = randomBytes(secretbox.nonceLength);
    const encrypted = secretbox(Buffer.from(plaintext), nonce, key);
    const lockedWallet = JSON.stringify({
      encrypted: bs58.encode(encrypted),
      nonce: bs58.encode(nonce),
      kdf,
      salt: bs58.encode(salt),
      iterations,
      digest,
    });
    localStorage.setItem(
      'locked',
      lockedWallet
    );
    sessionStorage.setItem(
      'locked',
      lockedWallet
    )
  } else {
    throw new Error('No password provided');
  }
  setUnlockedWallet(
    wallet
  );
}

export function hasWallet() {
  return localStorage.getItem('locked') !== null || sessionStorage.getItem('locked') !== null ||
      localStorage.getItem('unlocked') !== null || sessionStorage.getItem('unlocked') !== null;
}

export function loadWallet(password) {
  const {
    encrypted: encodedEncrypted,
    nonce: encodedNonce,
    salt: encodedSalt,
    iterations,
    digest,
  } = JSON.parse(localStorage.getItem('locked') || sessionStorage.getItem('locked'));
  const encrypted = bs58.decode(encodedEncrypted);
  const nonce = bs58.decode(encodedNonce);
  const salt = bs58.decode(encodedSalt);
  const key = deriveEncryptionKey(password, salt, iterations, digest);
  const plaintext = secretbox.open(encrypted, nonce, key);
  if (!plaintext) {
    throw new Error('Incorrect password');
  }
  const decodedPlaintext = Buffer.from(plaintext).toString();
  const wallet = JSON.parse(decodedPlaintext);

  setUnlockedWallet(
    wallet
  );
  return wallet;
}

function deriveEncryptionKey(password, salt, iterations, digest) {
  return pbkdf2.pbkdf2Sync(password, salt, iterations, secretbox.keyLength, digest);
  /*return new Promise((resolve, reject) =>
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      secretbox.keyLength,
      digest,
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );*/
}

export function lockWallet() {
  setUnlockedWallet(EMPTY_WALLET);
}

export function forgetWallet() {
  localStorage.clear();
  sessionStorage.removeItem('locked');
  setUnlockedWallet(EMPTY_WALLET);
  window.location.reload();
}
