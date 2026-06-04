from flask import Blueprint, jsonify, request
from backend.app.models.loan_applications import LoanApplications
from backend.app.extensions import db


