import {useState, useEffect} from 'react';
function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  async function fetchUrl() {
    const list = [];
    const userList = [];
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
    );
    //console.log(response);
    const json = await response.json();
    console.log(json.length);
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
      console.log('Storylist length: ' + list.length);
    }
    console.log('story fetched');
    for await (let item of list) {
      console.log(item.by);
      const user = await fetch(
        `https://hacker-news.firebaseio.com/v0/user/${item.by}.json`,
      );
      const json = await user.json();
      console.log(json.karma);
      userList.push({...item, karma: json.karma, authorID: json.id});
    }
    console.log('List completed');

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
  return [data, loading, refreshing];
}
export {useFetch};
