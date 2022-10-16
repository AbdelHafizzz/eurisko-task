import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../utils/colors";

const ArticleCard = ({ title, author, description }) => {
  const [descToShow, setDescToShow] = useState("");
  const [fullDesc, setFullDesc] = useState(description);
  const [showToggler, setShowToggler] = useState(false);
  const [togglerText, setTogglerText] = useState("  read more...");

  useEffect(() => {
    setFullDesc(description);
    if (description.length > 350) {
      setDescToShow(description.substring(0, 350));
      setShowToggler(true);
    }
  }, []);

  const toggleReadMore = () => {
    showToggler === false
      ? setTogglerText("  read more...")
      : setTogglerText("read less");
    setShowToggler(!showToggler);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {author && <Text style={styles.author}>{author}</Text>}
        <Text style={styles.desc}>
          <Text>
            {descToShow && showToggler ? descToShow : fullDesc}
            {descToShow && (
              <TouchableOpacity onPress={() => toggleReadMore()}>
                <Text style={{ color: COLORS.blue }}>{togglerText}</Text>
              </TouchableOpacity>
            )}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default ArticleCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    elevation: 2,
    zIndex: 2,
    marginVertical: 5,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  desc: {
    fontSize: 16,
    color: COLORS.fontColor,
  },
  author: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
    alignItems: "center",
  },
});
