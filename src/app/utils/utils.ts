/**
 * Creates a delay for the specified number of milliseconds
 * @param ms Number of milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}; 