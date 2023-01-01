import { useState, useEffect } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, FlatList, Image, Pressable } from 'react-native';
import { useQuery, gql, InMemoryCache } from "@apollo/client";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function SpaceXLaunchList() {

    // const [apiResponse, setApiResponse] = useState([])
    // const [loading, setLoading] = useState(false);

    const ImagesCard = ({ item }) => {
        return (

            <Image
                source={{ uri: `${item}` }}
                style={{
                    height: 300,
                }}
            />

        )
    }

    const AccordianItem = ({ title, body }) => {
        const [showBody, setShowBody] = useState(false);
        return (
            <View style={styles.AccordianContainer} >
                <Pressable style={{ justifyContent: 'space-between', flexDirection: 'row' }} onPress={() => { setShowBody(!showBody) }}>
                    <Text style={{
                        fontSize: showBody ? 30 : 20,
                        paddingVertical: 5,
                        fontWeight: showBody ? "bold" : "normal",
                    }}>{title}</Text>
                    {showBody ? <Icon name='chevron-down' size={30} color='black' /> : <Icon name='chevron-right' size={30} color='black' />}

                </Pressable>
                {
                    showBody &&
                    <View>
                        <Text style={styles.bodyText}>{body.launch_site.site_name_long === null ? "Not Available" : `Site Name: ${body.launch_site.site_name_long}`}</Text>
                        {/* <Text style={styles.bodyText}>{body.launch_year === null ? "Data not available" : `Launch Year ${body.launch_year}`}</Text> */}
                        <Text style={styles.bodyText}>{body.launch_date_local === null ? "Launch date not Available" : `Launch Date: ${body.launch_date_local}`}</Text>
                        <Text style={styles.bodyText}>{body.rocket.rocket_name === null ? "Rocket name not Available" : `Rocket Name: ${body.rocket.rocket_name}`}</Text>
                        <Text style={styles.bodyText}>{body.details === null ? "Details not Available" : `Details: ${body.details}`}</Text>
                        {body.links.article_link !=null ? <Pressable onPress={() => Linking.openURL(body.links.article_link)}>
                                <Text style={[styles.bodyText,{color:'blue'}]}>{`${body.links.article_link}`}</Text>
                            </Pressable> :
                            <Text>Article link not Available</Text>
                            }

                        {
                            body.links.flickr_images.length > 0 ?
                                <Image
                                    source={{ uri: body.links.flickr_images[0] }}
                                    style={{
                                        height: 300,
                                        borderRadius: 10
                                    }}
                                /> :
                                <Text>Image not available</Text>
                        }

                        {/* <ScrollView horizontal={true}>
                            <View>
                                {
                                    body.links.flickr_images.map((data,index)=>{
                                        return (<Image source={{uri:data}} key={index} style={{
                                            height:300,
                                        }}/>)
                                    })
                                }
                            </View>
                        </ScrollView> */}

                    </View>
                }
            </View>
        )
    }

    const API_QUERY = gql`
    query launchesPast($offset: Int, $limit: Int) {
        launchesPast(offset: $offset, limit: $limit) {
            mission_name
            launch_date_local
            launch_site {
            site_name_long
            site_name
            }
            links {
            article_link
            flickr_images
            }
            details
            launch_success
            rocket {
            rocket_name
            }
        }
        
    }
    `;

    const { data, loading, fetchMore, error } = useQuery(API_QUERY, {
        variables: { offset: 0, limit: 15 },
        fetchPolicy: "network-only",
    });

    if (error) alert(error);


    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (
        <ScrollView onScrollEndDrag={(e) => {
            if (isCloseToBottom(e.nativeEvent)) {
                fetchMore({
                    variables: {
                        offset: data.launchesPast.length,
                        limit: data.launchesPast.length * 2,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return Object.assign({}, prev, {
                            launchesPast: [...prev.launchesPast, ...fetchMoreResult.launchesPast]
                        });
                    }
                })
            }
        }}>
            <View>
                {data &&
                    data.launchesPast.map((data, index) => {
                        return (
                            <AccordianItem title={data.mission_name} body={data} key={index} />
                        )
                    })
                }

                <ActivityIndicator animating={loading} />

                {/* <Pressable onPress={() => }>
                    <View>
                        <Text style={styles.showMoreBtn}>Show More<Icon name="chevron-down" size={15} color="#000" /></Text>
                        
                    </View>
                </Pressable> */}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    AccordianContainer: {
        backgroundColor: "#f6f7f8",
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 5,
        borderRadius: 10,
        shadowColor: '#4D77FF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 10,
        shadowRadius: 2,
        elevation: 5
    },
    bodyText: {
        paddingVertical: 5,
    },
    showMoreBtn: {
        textAlign: 'center',
        fontSize: 15,
    }
});

export default SpaceXLaunchList;