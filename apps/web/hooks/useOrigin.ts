export const useOrigin = () => {
    const _origin = typeof window !== 'undefined' ? window.location.origin : ''
    return _origin
}