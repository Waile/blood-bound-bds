import Button from "../Button";
import CreateRequestPopup from "./CreateRequestPopup";

import { useState } from "react";
import { useSelector } from "react-redux";

const Header = (props) => {
	const [modalShow, setModalShow] = useState(false);

	const { userType } = useSelector((state) => state.user);

	return (
		<header className="header">
			<h1>Latest Requests</h1>
			<form>
				<label style={{marginRight:'150px'}}>
					Number of Requests to Display (3-50):&nbsp;&nbsp;
					<input type="number" min="3" max="50" value={props.amount} onChange={(e) => props.setAmount(e.target.value)} style={{paddingLeft:'5px', width:'13%'}}></input>
				</label>
			</form>
			{
				userType != 'Customer_Support' ? (<Button styles={{color:'white', backgroundColor:'black', height:'50px', width:'120px'}} text="Add" onClick={() => setModalShow(true)} />)
				: (<div></div>)
			}
			<CreateRequestPopup
				show={modalShow}
				onHide={() => setModalShow(false)}
				onSubmit={props.onAdd}
			/>
		</header>
	);
};

export default Header;