// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function decimals() external view returns (uint8);
}

contract RootstockPriceConsumer {
    AggregatorV3Interface public immutable feed;

    constructor(address feedAddress) {
        require(feedAddress != address(0), "feed is zero address");
        feed = AggregatorV3Interface(feedAddress);
    }

    function getLatestPrice()
        external
        view
        returns (int256 price, uint8 decimals, uint256 updatedAt)
    {
        (, int256 answer, , uint256 updatedAtRaw, ) = feed.latestRoundData();
        uint8 feedDecimals = feed.decimals();
        return (answer, feedDecimals, updatedAtRaw);
    }
}
