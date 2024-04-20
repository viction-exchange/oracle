// SPDX-License-Identifier: MIT
pragma solidity =0.8.17;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {PriceFeed} from "../PriceFeed.sol";

contract UnsafePriceUpdater is AccessControl {
    event NewPriceFeed(address token, bytes32 priceId, address priceFeed);
    event PriceUpdate(address token, int256 price, address priceFeed);

    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER");

    mapping(bytes32 => PriceFeed) public priceFeeds;
    mapping(bytes32 => address) public priceTokens;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPDATER_ROLE, msg.sender);
    }

    receive() external payable {}

    function deployPriceFeed(
        address token,
        bytes32 priceId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (priceTokens[priceId] == address(0)) {
            priceTokens[priceId] = token;
            priceFeeds[priceId] = new PriceFeed();
            emit NewPriceFeed(token, priceId, address(priceFeeds[priceId]));
        }
    }

    function update(
        int256[] calldata prices,
        bytes32[] calldata priceIds
    ) public payable onlyRole(UPDATER_ROLE) {
        require(prices.length == priceIds.length, "Invalid input");

        // Update price feeds
        for (uint256 i = 0; i < priceIds.length; i++) {
            bytes32 priceId = priceIds[i];
            priceFeeds[priceId].setLatestAnswer(prices[i]);
            emit PriceUpdate(
                priceTokens[priceId],
                prices[i],
                address(priceFeeds[priceId])
            );
        }
    }
}
