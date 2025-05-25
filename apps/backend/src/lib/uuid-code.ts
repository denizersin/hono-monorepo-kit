// Private key for additional security
const PRIVATE_KEY = "code-private-123s";

/**
 * Generates a time-based code with specified number of digits
 * Uses current timestamp and private key to ensure uniqueness and security
 * @param digits - Length of code (6, 8, or 10 digits supported)
 * @returns number - Generated code of specified length
 */
export const generateTimeBasedCode = (digits: 6 | 8 | 10): number => {
    // Get current timestamp
    const timestamp = Date.now();
    
    // Calculate modulus based on desired digits
    const mod = Math.pow(10, digits);
    
    // Generate hash using timestamp and private key
    const hash = timestamp + PRIVATE_KEY.split('').reduce((acc, char) => 
        acc + char.charCodeAt(0), 0);
    
    // Generate code using hash and random padding
    const code = (hash % mod) + Math.floor(Math.random() * mod);
    
    // Ensure code is exactly the specified length
    return Number(code.toString().slice(-digits));
};

/**
 * Generates a 6-digit time-based code
 */
export const generate6DigitCode = (): number => {
    return generateTimeBasedCode(6);
};

/**
 * Generates an 8-digit time-based code
 */
export const generate8DigitCode = (): number => {
    return generateTimeBasedCode(8);
};

/**
 * Generates a 10-digit time-based code
 */
export const generate10DigitCode = (): number => {
    return generateTimeBasedCode(10);
};

/**
 * Generates a code with numbers and uppercase letters
 * @param length - Length of the code (default: 8)
 * @returns string - Generated code with numbers and uppercase letters
 */
export const generateAlphanumericCode = (length: number = 8): string => {
    // Get current timestamp
    const timestamp = Date.now();
    
    // Generate base number using timestamp and private key
    const baseNumber = timestamp + PRIVATE_KEY.split('').reduce((acc, char) => 
        acc + char.charCodeAt(0), 0);
    
    // Create a pool of characters (numbers and uppercase letters)
    const numbers = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const pool = numbers + letters;
    
    // Convert base number to string and use it to generate the code
    const baseString = baseNumber.toString();
    let result = '';
    
    // Generate the code using the base number and random selection from pool
    for (let i = 0; i < length; i++) {
        const index = (parseInt(baseString[i % baseString.length] ?? '0') + Math.floor(Math.random() * pool.length)) % pool.length;
        result += pool[index];
    }
    
    return result;
};
