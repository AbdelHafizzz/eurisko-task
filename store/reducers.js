const initialState = {
  authToken: null,
  userData: {},
  articles: [],
  filteredArticles: [],
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVEFILTEREDARTICLES":
      return {
        ...state,
        filteredArticles: action.payload,
      };
    case "SAVEARTICLES":
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
      };
    case "LOGIN":
      return {
        ...state,
        authToken: action.payload.token,
        userData: action.payload.userData,
      };
    case "LOGOUT":
      return { ...state, authToken: action.payload };
    default:
      return state;
  }
};

export default AuthReducer;
