import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import ArticleCard from "../components/ArticleCard";
import COLORS from "../utils/colors";

const Articles = () => {
  const token = useSelector((state) => state.auth.authToken);
  const [articles, setArticles] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [dismissDisabled, setDismissDisabled] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    handleFetchArticles();
  }, []);

  const handleFetchArticles = async () => {
    setApiFailed(false);
    const headers = {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    await axios
      .get(`http://34.245.213.76:3000/articles?page=${page}`, {
        headers: headers,
      })
      .then((res) => {
        setArticles([...articles, ...res.data.response.docs]);
        res.data.response.docs.length > 0 && setPage((prev) => prev + 1);
        setLoading(false);
      })
      .finally(() => dispatch({ type: "SAVEARTICLES", payload: articles }))
      .catch((error) => {
        setApiFailed(true);
        console.log(error);
      });
  };

  const handleOnChange = (value) => {
    setFilterQuery(value);
  };

  const handleClearFilter = () => {
    setFilterQuery("");
    setDismissDisabled("never");
  };

  const reachedBottom = ({ layoutMeasurement, contentSize, contentOffset }) => {
    const pb = 20;
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - pb
    );
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(0);
    setArticles([]);
    handleFetchArticles();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps={dismissDisabled}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({ nativeEvent }) => {
        if (reachedBottom(nativeEvent)) {
          if (!loading && !filterQuery) {
            setLoading(true);
            handleFetchArticles();
          }
        }
      }}
    >
      <View style={styles.inputContainer}>
        <TextInput
          onFocus={() => setDismissDisabled("true")}
          // onPressOut={() => setDismissDisabled("never")}
          onChangeText={(value) => handleOnChange(value)}
          value={filterQuery}
          placeholder="Search articles"
          style={styles.input}
          placeholderTextColor="gray"
        />
        {filterQuery && (
          <TouchableOpacity
            onPress={() => handleClearFilter()}
            style={styles.eye}
          >
            <Icon name="closecircle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {apiFailed ? (
        <Text style={styles.wrong}>Sorry something went wrong</Text>
      ) : (
        articles
          .filter((art) => {
            if (filterQuery === "") {
              return art;
            } else {
              if (
                art.abstract
                  .toLowerCase()
                  .includes(filterQuery.toLowerCase()) ||
                art.lead_paragraph
                  .toLowerCase()
                  .includes(filterQuery.toLowerCase())
              ) {
                return art;
              }
            }
          })
          .map((article, i) => {
            i === 0 &&
              dispatch({ type: "SAVEFILTEREDARTICLES", payload: articles });

            return (
              <ArticleCard
                key={`article${i}`}
                title={article.abstract}
                author={article.byline.original}
                description={article.lead_paragraph}
              />
            );
          })
      )}
    </ScrollView>
  );
};

export default Articles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 15,
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 3,
  },
  input: { flex: 1 },
  wrong: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    color: COLORS.gray,
  },
});
