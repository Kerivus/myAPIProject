import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button
} from 'reactstrap';

export class GameCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { id,name,image,date } = this.props.gamelist;
    return (
      <div>
        <Card>
          <CardImg top width="350px" src={image} alt="Card image cap" />
          <CardBody>
            <CardTitle>{name}</CardTitle>
            <CardText>{date}</CardText>
            <Button
              color="primary"
              onClick={() => this.props.viewDetails(id)}
            >
              View
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default GameCard;