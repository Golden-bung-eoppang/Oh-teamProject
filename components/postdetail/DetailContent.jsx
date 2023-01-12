import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import styled from "@emotion/native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../util";
import { deletePost, getDetail } from "../../posts";
import { useQuery, useMutation } from "react-query";
import DropDown from "../DropDown";
import { auth } from "../../firebase";
import YoutubePlayer from "react-native-youtube-iframe";

const DetailContent = ({ item }) => {
  const { navigate } = useNavigation();

  // youtube 업로드
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);


  const postId = item.id;

  const { isLoading, data } = useQuery(["contents", postId], getDetail, {
    onSuccess: () => {
      console.log("로딩되었습니다!");
    },
    onError: (error) => {
      console.log("error : ", error);
    },
  });

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <ContentHeader>
        <UserInfo>
          <UserImage
            source={require("../../assets/icon.png")}
            style={{ width: 70, height: 70 }}
          />
          <Nickname>{data?.data().userName}</Nickname>
        </UserInfo>
      </ContentHeader>
      {item.userId === auth.currentUser.uid ? <DropDown item={item} /> : null}
      {item.videoLink ? (
        <YoutubeWrapper>
          <YoutubePlayer
            height={"100%"}
            play={playing}
            videoId={data?.data().videoLink?.slice(-11)}
            onChangeState={onStateChange}
          />
        </YoutubeWrapper>
      ) : null}
      <ContentText>{data?.data().text}</ContentText>
    </View>
  );
};

//콘텐츠,코멘트 헤더 (프로필 + 버튼)
const ContentHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${SCREEN_WIDTH / 1.15 + "px"};
  margin: 10% auto 0 auto;
`;
const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;
const UserImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 70px;
  overflow: hidden;
  margin-right: 10%;
`;
const Nickname = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.color};
`;

//콘텐츠 내용
const ContentText = styled.Text`
  width: 85%;
  font-size: 18px;
  line-height: 27px;
  color: ${(props) => props.theme.color};
  margin: auto;
`;

// 콘텐츠 내용 ( 유튜브영상 )
const YoutubeWrapper = styled.View`
  width: 98%;
  height: ${SCREEN_HEIGHT / 3 + "px"};
  margin: auto;
  padding-top: 20px;
`;
export default DetailContent;
