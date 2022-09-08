import './Button.css';

const Button = ({ text, onClick, onSubmit, id }) => {
	return (
		<div>
			<button className='btn-3' onClick={onClick} onSubmit={onSubmit} id={id}>
				{text}
			</button>
		</div>
	);
};

export default Button;