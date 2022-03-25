import React from 'react'
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import "./header.css"


function header() {
    return (
        <div>
            <Row>
                <Col>
                    <Nav.Link as={NavLink} to="/health/summary">
                        Summary
                    </Nav.Link>
                </Col>
                <Col>
                    <Nav.Link as={NavLink} to="/health/careplan">
                        Care Plan
                    </Nav.Link>
                </Col>
                <Col>
                    <Nav.Link as={NavLink} to="/health/history">
                        History
                    </Nav.Link>
                </Col>
            </Row>
        </div>
    )
}

export default header;
