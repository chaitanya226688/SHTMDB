jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
    runAfterInteractions: jest.fn((callback) => callback()), // Instantly invoke callbacks
}));

jest.useFakeTimers()