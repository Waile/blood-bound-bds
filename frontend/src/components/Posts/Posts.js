import Post from "./Post";

const Posts = ({ posts, onFulfill, setModalShowProfile }) => {
	return (
		<div>
			{
				posts.map((post) => (
					<Post
						key={post._id}
						className="container2"
						post={post}
						onFulfill={(post) => onFulfill(post)}
                        setModalShowProfile={setModalShowProfile}
					/>
				))
			}
		</div>
	);
};

export default Posts;
