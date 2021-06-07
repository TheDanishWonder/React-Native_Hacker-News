import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';

import {useFetch} from '../api/hooks';
const Top10News = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = () => {
    //Clear old data of the list
    setData([]);
    //Call the Service to get the latest data
    fetchUrl();
  };

  async function fetchUrl() {
    const list = [];
    const userList = [];
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
    );
    //console.log(response);
    const json = await response.json();
    //console.log(json.length);
    const random10 = Math.floor(Math.random() * json.length);

    for await (let id of json.slice(random10, random10 + 10)) {
      //console.log('foreach function init');
      const item = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      const json = await item.json();
      //console.log(json.length);
      list.push({
        by: json.by,
        title: json.title,
        score: json.score,
        url: json.url,
        time: json.time,
      });
      //console.log('Storylist length: ' + list.length);
    }
    //console.log('story fetched');
    for await (let item of list) {
      //console.log(item.by);
      const user = await fetch(
        `https://hacker-news.firebaseio.com/v0/user/${item.by}.json`,
      );
      const json = await user.json();
      //console.log(json.karma);
      userList.push({...item, karma: json.karma, authorID: json.id});
    }
    //console.log('List completed');

    setData(
      userList.sort((a, b) => {
        return b.score - a.score;
      }),
    );
    //console.log(data);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchUrl();
  }, []);

  const itemView = ({item}) => {
    let date = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(item.time);
    return (
      <View style={styles.container}>
        <View style={styles.score}>
          <Text style={styles.scoreText}>{item.score}</Text>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.titleBox}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{item.title} </Text>
              <Text style={styles.urlText}>({item.url})</Text>
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.info}>
              <Text style={styles.text}>By </Text>
              <Text style={styles.by}>{item.by} </Text>
              <Text style={styles.karma}>- {item.karma}</Text>
            </View>
            <View style={styles.posted}>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {loading ? (
        <Text>'Loading...'</Text>
      ) : (
        <View style={{marginBottom: 50}}>
          <FlatList
            data={data}
            renderItem={itemView}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      )}
    </View>
  );
};
export default Top10News;

const styles = StyleSheet.create({
  container: {
    marginTop: 0.5,
    marginBottom: 0.5,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  score: {
    width: '15%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'orange',
    fontSize: 18,
  },
  subContainer: {
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
  },
  titleBox: {
    flexDirection: 'row',
  },
  title: {},
  urlText: {
    fontSize: 12,
    color: 'gray',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  by: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: 'darkorange',
  },
  text: {
    fontWeight: 'bold',
    color: 'darkorange',
  },
  karma: {
    color: 'darkorange',
    fontWeight: 'bold',
  },
  posted: {
    marginTop: 5,
  },
  date: {
    fontSize: 10,
  },
});
