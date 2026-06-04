import pandas as pd
import click
from flask.cli import with_appcontext
from backend.app.extensions import db
from backend.app.models import LoanApplications
from backend.app.services.prediction_service import run_bulk_prediction, feature_columns

@click.command("ingest-data")
@click.argument("file_path")
@with_appcontext
def ingest_data(file_path):
    """Ingest data from a CSV file into the database."""
    print(f"Reading data from {file_path}...")
    df = pd.read_csv(file_path).head(2000)

    invalid_df = df[df[feature_columns].isnull().any(axis=1)]
    df = df.dropna(subset=feature_columns)
    print(
        f"Dropped {len(invalid_df)} rows "
        f"due to missing ML features."
    )

    initial_count = len(df)
    dropped_count = initial_count - len(df)
    if dropped_count > 0:
        print(f"Dropped {dropped_count} rows with missing values in feature columns.")

    print(f"Running bulk prediction for {len(df)} records...")
    df = run_bulk_prediction(df)

    data_dicts = df.to_dict(orient='records')

    chunk_size = 1000
    print(f"Ingesting into database in chunks of {chunk_size}...")
    for i in range(0, len(data_dicts), chunk_size):
        chunk = data_dicts[i : i + chunk_size]
        db.session.bulk_insert_mappings(LoanApplications, chunk)
        db.session.commit()
        print(f"Ingested {min(i + chunk_size, len(data_dicts))} / {len(data_dicts)}...")
    print("Data ingestion complete.")