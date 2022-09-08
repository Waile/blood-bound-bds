import "bootstrap/dist/css/bootstrap.min.css";
import { parseDate } from "../../utils/utils";

function ChatMessage(props) {
    return (
        <div>
            {
                // Rendering the viewer's own messages on the right of the screen.
                props.author == props.viewer ?
                (
                    <div style={{marginRight:'10px',
                                marginTop:'10px',
                                float:'right',
                                backgroundColor:'pink',
                                maxWidth:'1200px',
                                paddingTop:'20px', paddingLeft:'20px', paddingRight:'20px', paddingBottom:'10px',
                                borderRadius:'20px', borderStyle:'groove', borderColor:'pink',
                                fontSize:`${props.textsize.value}`}}>
                        <span>{props.message}</span>
                        <div style={{right:'0px', bottom:'0px', float:'right', marginTop:'20px', fontSize:'75%'}}>
                            <span>{parseDate(props.date)}</span>
                        </div>
                    </div>
                ) :
                (
                    // Rendering the recipient's messages on the left of the screen.
                    <div style={{marginLeft:'10px',
                                marginTop:'10px',
                                float:'left',
                                backgroundColor:'violet',
                                maxWidth:'1200px',
                                paddingTop:'20px', paddingLeft:'20px', paddingRight:'20px', paddingBottom:'10px',
                                borderRadius:'20px', borderStyle:'groove', borderColor:'violet',
                                fontSize:`${props.textsize.value}`}}>
                        <span>{props.message}</span>
                        <div style={{right:'0px', bottom:'0px', float:'right', marginTop:'20px', fontSize:'75%'}}>
                            <span>{parseDate(props.date)}</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ChatMessage;