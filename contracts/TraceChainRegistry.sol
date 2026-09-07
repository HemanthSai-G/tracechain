// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TraceChainRegistry
 * @dev Cryptographic content fingerprint registry for immutable web discovery verification.
 * Built for HH Goa 2026.
 */
contract TraceChainRegistry {
    struct Record {
        bytes32 fingerprint;
        uint256 timestamp;
        address submitter;
        string sourceUrl;
        bool exists;
    }

    // Mapping from fingerprint hash to record metadata
    mapping(bytes32 => Record) private _records;

    // Total count of registered fingerprints
    uint256 public totalRecords;

    // Events
    event FingerprintRegistered(
        bytes32 indexed fingerprint,
        address indexed submitter,
        uint256 timestamp,
        string sourceUrl
    );

    /**
     * @notice Register a SHA-256 fingerprint on the blockchain.
     * @param fingerprint The bytes32 SHA-256 hash of the canonical content.
     * @param sourceUrl The source URL of the discovered content.
     */
    function registerFingerprint(bytes32 fingerprint, string calldata sourceUrl) external returns (bool) {
        require(fingerprint != bytes32(0), "Invalid fingerprint");
        require(!_records[fingerprint].exists, "Fingerprint already registered");

        _records[fingerprint] = Record({
            fingerprint: fingerprint,
            timestamp: block.timestamp,
            submitter: msg.sender,
            sourceUrl: sourceUrl,
            exists: true
        });

        totalRecords++;

        emit FingerprintRegistered(fingerprint, msg.sender, block.timestamp, sourceUrl);
        return true;
    }

    /**
     * @notice Verify whether a fingerprint exists on-chain and retrieve its metadata.
     * @param fingerprint The SHA-256 fingerprint to verify.
     */
    function verifyFingerprint(bytes32 fingerprint)
        external
        view
        returns (
            bool exists,
            bytes32 registeredFingerprint,
            uint256 timestamp,
            address submitter,
            string memory sourceUrl
        )
    {
        Record memory rec = _records[fingerprint];
        return (rec.exists, rec.fingerprint, rec.timestamp, rec.submitter, rec.sourceUrl);
    }
}
