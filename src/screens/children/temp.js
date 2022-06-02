<ScrollView>
  {children ? (
    children.map((child) => {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          key={child.id}
          onPress={async () => {
            await AsyncStorage.setItem("childId", child.id.toString());
            navigation.navigate("ChildrenDetail");
          }}
        >
          <ListItem id={child.id} key={child.id} name={child.fullName} />
          {/* <Button
                    title="Delete"
                    onPress={() => createDeleteDialog(child.id)}
                  /> */}
          <TouchableOpacity onPress={() => createDeleteDialog(child.id)}>
            <Feather style={{ top: 5 }} name="trash" size={24} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    })
  ) : (
    <Text
      style={{
        textAlign: "center",
        fontStyle: "italic",
        marginTop: 15,
      }}
    >
      Chưa có dữ liệu
    </Text>
  )}
  {total > 5 ? (
    <View>
      {page === 1 ? (
        <View
          style={{
            top: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            title="Next Page"
            onPress={() => {
              setPage(page + 1);
              if (keyword) {
                search();
              } else {
                getChildren();
              }
            }}
          />
        </View>
      ) : page !== 0 ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            top: 10,
          }}
        >
          <Button
            title="Prev Page"
            onPress={() => {
              setPage(page - 1);
              if (keyword) {
                search();
              } else {
                getChildren();
              }
            }}
          />
          {page === children.pages ? (
            <></>
          ) : (
            <Button
              title="Next Page"
              onPress={() => {
                setPage(page + 1);
                if (keyword) {
                  search();
                } else {
                  getChildren();
                }
              }}
            />
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  ) : (
    <></>
  )}
</ScrollView>;
